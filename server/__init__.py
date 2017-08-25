from girder.utility import setting_utilities
from girder.models.model_base import ValidationException
from girder.api import access
from girder.api.rest import Resource, filtermodel, RestException
from girder.api.describe import autoDescribeRoute, Description
from girder.utility.model_importer import ModelImporter

@setting_utilities.validator('annotation_domain_list')
def _validateDefaultImage(doc):
    if not isinstance(doc['value'], dict):
        raise ValidationException('Annotation domain list must be a dictionary')

@setting_utilities.validator('annotation_study_list')
def _validateDefaultImage(doc):
    if not isinstance(doc['value'], list):
        raise ValidationException('Annotation study list must be a list')

@access.public
@autoDescribeRoute(
    Description('Return the list of annotation domains')
)
def getAnnotationDomains():
    return ModelImporter.model('setting').get('annotation_domain_list', default=[])

@access.public
@autoDescribeRoute(
    Description('Load the list of annotation domains')
    .param('newDomainKey', 'New domain key value', dataType='string', required=False)
    .param('newDomainVal', 'New domain value', dataType='string', required=False)
)
def putAnnotationDomains(newDomainKey, newDomainVal):
    myDomains = getAnnotationDomains()
    myDomains[newDomainKey] = newDomainVal
    return ModelImporter.model('setting').set('annotation_domain_list', myDomains)

@access.public
@autoDescribeRoute(
    Description('Set the list of annotation studies')
    .param('studies', 'The input of studies.', dataType='string', required=False)
)
def updateStudies(studies):
    myStudies = getAnnotationStudies()
    if not studies in myStudies:
        myStudies.append(studies)
        return ModelImporter.model('setting').set('annotation_study_list', myStudies)
    else:
        return "already exists"

@access.public
@autoDescribeRoute(
    Description('Get the list of annotation studies')
)
def getAnnotationStudies():
    return ModelImporter.model('setting').get('annotation_study_list', default=[])

@access.public
@autoDescribeRoute(
    Description('Delete a single study from annotation studies')
    .param('study', 'The study to be deleted', dataType='string', required=False)
)
def deleteAnnotationStudy(study):
    myStudies = getAnnotationStudies()
    if study in myStudies:
        myStudies.remove(study)
        return ModelImporter.model('setting').set('annotation_study_list', myStudies)
    else:
        #raise RestException('The study %s does not exist.' % study, code=401)
        return "no study found"

def load(info):
    info['apiRoot'].system.route('GET', ('annotation_domains',), getAnnotationDomains)
    info['apiRoot'].system.route('PUT', ('annotation_domains',), putAnnotationDomains)
    info['apiRoot'].system.route('PUT', ('annotation_studies',), updateStudies)
    info['apiRoot'].system.route('GET', ('annotation_studies',), getAnnotationStudies)
    info['apiRoot'].system.route('DELETE', ('annotation_studies',), deleteAnnotationStudy)
