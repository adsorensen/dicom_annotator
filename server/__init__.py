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

# @setting_utilities.validator('annotation_study_list')
# def _validateDefaultImage(doc):
#     if not isinstance(doc['value'], dict):
#         raise ValidationException('Annotation study list must be a list')

@access.public
@autoDescribeRoute(
    Description('Return the list of studies and labels for each.')
)
def getAnnotationDomains():
    return ModelImporter.model('setting').get('annotation_domain_list', default=[])

@access.public
@autoDescribeRoute(
    Description('Load the list of annotation domains')
    .param('study', 'Study that the new dictionary goes into.', dataType='string', required=False)
    .param('newKey', 'New domain key value', dataType='string', required=False)
    .param('newValue', 'New domain value', dataType='string', required=False)
)
def updateAnnotationDomains(study, newKey, newValue):
    myStudies = getAnnotationDomains()
    newDict = {newKey: newValue}
    newDict2 = {}
    if not study in myStudies:
        if not newKey and not newValue:
            myStudies[study] = newDict2
        else:
            myStudies[study] = newDict
        return ModelImporter.model('setting').set('annotation_domain_list', myStudies)
    else:
        if not newKey and not newValue:
            return "already exists"
        else:
            oldDict = myStudies[study]
            myStudies[study] = {**oldDict, **newDict}
        return ModelImporter.model('setting').set('annotation_domain_list', myStudies)


@access.public
@autoDescribeRoute(
    Description('Delete a domain key and value from the system')
    .param('study', 'The study that has the domain key.', dataType='string', required=False)
    .param('domainKey', 'The domain key to be deleted. If this is empty, '
        'then the entire study will be deleted.', dataType='string', required=False)
)
def deleteAnnotationDomain(study, domainKey):
    myStudies = getAnnotationDomains()
    if study in myStudies:
        if not domainKey:
            myStudies.pop(study, None)
        else:
            if not domainKey in myStudies[study]:
                return "domain key not found in the study."
            tempD = myStudies[study]
            tempD.pop(domainKey, None)
            myStudies[study] = tempD
        return ModelImporter.model('setting').set('annotation_domain_list', myStudies)
    else:
        return "study not found"

@access.public
@autoDescribeRoute(
    Description('Get study\'s labels.')
    .param('study', 'The study that has the domain key.', dataType='string', required=False)
)
def getStudyLabels(study):
    myStudies = getAnnotationDomains()
    if not study:
        return {}
    if study in myStudies:
        return myStudies[study]
    else:
        return "study not found"

def load(info):
    info['apiRoot'].system.route('GET', ('annotation_domains',), getAnnotationDomains)
    info['apiRoot'].system.route('PUT', ('annotation_domains',), updateAnnotationDomains)
    info['apiRoot'].system.route('GET', ('annotation_labels',), getStudyLabels)
    info['apiRoot'].system.route('DELETE', ('annotation_domains',), deleteAnnotationDomain)
