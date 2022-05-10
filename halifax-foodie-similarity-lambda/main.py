import calendar
import time

from googleapiclient import discovery


def hello_gcs(event, context):
    training_inputs = {
        'scaleTier': 'BASIC',
        "packageUris": ["gs://recipe-classification-model/halifax-foodie-similarity-model.tar.gz"],
        "pythonModule": "trainer.task",
        "region": "us-central1",
        "runtimeVersion": "2.1",
        "jobDir": "gs://recipe-classification-output",
        "pythonVersion": "3.7"
    }
    timestamp = time.gmtime()
    job_name = 'recipe_classification_' + str(calendar.timegm(timestamp))
    job_spec = {'jobId': job_name, 'trainingInput': training_inputs}
    project_id = 'projects/csci-5408-w21-305118'
    cloudml = discovery.build('ml', 'v1')
    request = cloudml.projects().jobs().create(body=job_spec, parent=project_id)
    response = request.execute()
