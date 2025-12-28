<h1 style="color: red;">Code Review</h1>

## first problem
sqli when pass email and password directly to query without sanitization or parameterization.
### solution
```typescript
const user = await pool.query(`SELECT * FROM users WHERE email=$1 AND
password=$2`, [email, password]);
```

## second problem
hashing algorithm md5 is not secure.
### solution
```typescript
const hash = crypto.createHash('sha256')
  .update(password)
  .digest('hex');
```

## third problem
pool.query can throw an error that is not handled.
### solution
```typescript
try {
  const user = await pool.query(`SELECT * FROM users WHERE email=$1 AND
  password=$2`, [email, password]);
} catch (error) {
  console.error('Database query error:', error);
  return res.status(500).json({ message: 'Internal server error' });
}
```

## fourth problem
sessions stored in memory can lead to data loss on server restart;
### solution
```txt
Use database to store sessions data or memory-base cache like redis.
```

## fifth problem
return password to frontend is a security risk.
even if hashed.
if attacker get access to response he can use hash to crack password.
### solution
```txt
create other table for invited users with unique token for each invited user.
when user accept invitation must create account first and delete the record from invited users table.
```

## sixth problem
cast objects to any type is unsafe and defeats the purpose of typescript.


<h1 style="color: red;">Scenario: Clinical Voice Notes, AI Summaries & Medical Insights</h1>

# Section 1: Requirements Clarification

## - rewrite requirements

doctor can record voice consultations on moblie app and upload them to server.
the server process the audio files using speech-to-text service to convert them into text.
ai summarization service is then used to generate a concise summary of the consultation.
the summary is stored in database and can be retrieved later by doctor or patient.
each record is linked to specific doctor and patient using their unique ids.
doctor can copy the summary into EHR/clinic systems
doctor can record personal notes
the data must stay follow RGPD rules and ensure patient confidentiality.

## - clarifying questions

1. the patient create account in the platform or just defined by unique id(save data vs patient stay unknow)?
2. the patient can ask doctor or just doctor can record summary?
3. pdf generated with ai and records or uploaded by doctor?
4. audio files format and max size?
5. how long the data must be stored?
6. any specific ehr/clinic systems to integrate with?
7. do we need multi-language support for speech-to-text and summarization?
8. do we need user authentication and authorization?
9. dashboard for doctors or for docktors and managers that oversee multiple doctors?
<!--10. do we need audit logs for data access and modifications?
10. do we need notifications for patients when new summaries are available?
11. do we need versioning for summaries in case of updates or corrections?
12. do we need to support telemedicine platforms for direct integration?
13. do we need to support offline mode for doctors to record and upload later?-->

# Section 2: Domain Modeling

## - main entities

- Recording
- Transcription
- SummarizationOutput
- Patient
- Doctor
- PersonalNote
- MedicalSource
- Recommendation
- AuditTrail
- DataRetentionPolicy

## - relationships

- Doctor have many Patient and Patient can have many doctors. (N:M) defined with Recording
- Doctor can have many PersonalNote. (1:N)
- A Doctor can have many MedicalSource. (1:N)
- Recording have SummarizationOutput. (1:1)
- AuditTrail have relationships with all entities. (1:1), with type field to define which entity it is related to with its primary key.
- A Recording can have one Transcription.

```text
with all this relationships we need relational database that why we choose postgresql.
```

# Section 3: API Design

## - Voice Recording Lifecycle
```
after doctor taps Record → Stop → Save
- audio file is uploaded after encryption to server with http that use tcp that ensure reliable data transfer even if network is unstable.
- server respond with 202 accepted and start processing the file asynchronously.
- doctor will see loading indicator while processing.
- in this time the audio is in queue to be processed by speech-to-text service.
when the audio be processed or faild:
- if failed retry 3 times and mark record as failed to be appear to the doctor 'this record failed to be processed'.
- if success the transcription is sent to ai summarization service in other queue.
when the summary is generated or faild:
- if failed retry 3 times and mark record as failed to be appear to the doctor 'this record failed to be processed'.
- if success the summary is stored in database linked to the recording, doctor and patient.
- doctor is notified that the summary is ready via push notification or in-app notification.
- doctor can view the summary in app and copy it to ehr/clinic systems.
- for `how disclaimer are attached` we can show it in the bottom of the summary with small font size or in the bottom of the page.
- all that will appear in web dashboard for doctor (or admins) to view and manage recordings and summaries, for example when record sended , in web dashboard we will see record in the queue to STT service, if failed , we will see it failed and reason of failure etc, and retried and optionally add button to cancel it, with ability to read the record to cancel it or let it be processed.
```
***There are many details to discuss, but it is best to keep it simple and concise.***

# Section 4: Real-Time Sync Trade-Offs

## - real-time sync
- battery impact (mobile): real-time sync can consume more battery due to constant connection and data transfer.
- cost model: real-time sync may incur higher costs due to continuous data transfer and server resources.
- offline caching: real-time sync can be more complex to implement offline caching as it requires handling real-time updates.
- conflict resolution: real-time sync may require more sophisticated conflict resolution mechanisms to handle concurrent updates.
### - periodic polling
- battery impact (mobile): periodic polling can be more battery-efficient as it reduces constant connection and data transfer.
- cost model: periodic polling may be more cost-effective as it reduces continuous data transfer and server resources.
- offline caching: periodic polling can be simpler to implement offline caching as it allows for batch updates.
- conflict resolution: periodic polling may require less complex conflict resolution mechanisms as updates are less frequent.


# Section 5: Failure Scenario Prioritization
if C mean duplicate recordings for 3% of Patient that two Patients linked with same record:<br>
```
  D - C - B - A
```
if C mean the record ceated two times and linked to same Patient:
```
  D - B - A - C
```
like that we have two C so:
```
  D - C1 - B - A - C2
```
D can kill patients so it is highest priority.
C1 the same as D , Patient lined with record for other Patient.
B can lead to data loss or incorrect summaries so it is high priority.
A is low priority because it only failed and never retry the doctor can retry manually until we fix it.

# Section 6: Prompt Injection Defenses
```txt
The AI is restricted to a limited context consisting only of the consultation transcription and approved medical PDFs,preventing access to unrelated or sensitive data.
In addition, input is analyzed to detect instruction-like patterns aimed at manipulating the model.
Outputs are constrained to a fixed summarization format and always include medical disclaimers, with final review performed by the doctor.
```
