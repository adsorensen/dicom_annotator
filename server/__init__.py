from girder.utility import setting_utilities
from girder.models.model_base import ValidationException
from girder.api import access
from girder.api.describe import autoDescribeRoute, Description
from girder.utility.model_importer import ModelImporter

@setting_utilities.validator('annotation_domain_list')
def _validateDefaultImage(doc):
    if not isinstance(doc['value'], list):
        raise ValidationException('Annotation domain list must be a list')

@access.public
@autoDescribeRoute(
    Description('Return the list of annotation domains')
)
def getAnnotationDomains(params):
    myDict = {'adam': 'hello', 'john': 8000}
    return ModelImporter.model('setting').get('annotation_domain_list', default=myDict)

def putAnnotationDomains(params):
    return ModelImporter.model('setting').put('annotation_domain_list', default=["hello"])


def load(info):
    info['apiRoot'].system.route('GET', ('annotation_domains',), getAnnotationDomains)
    info['apiRoot'].system.route('PUT', ('annotation_domains',), putAnnotationDomains)
