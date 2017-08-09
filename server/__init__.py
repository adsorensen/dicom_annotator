from girder.utility import setting_utilities
from girder.models.model_base import ValidationException
from girder.api import access
from girder.api.rest import Resource, filtermodel
from girder.api.describe import autoDescribeRoute, Description
from girder.utility.model_importer import ModelImporter
from . import constants


# class Annotator(Resource):

#     def __init__(self):
#         super(Annotator, self).__init__()
#         self.resourceName = 'system'
#         #self.route('PUT', ('annotation_studies',), self.updateStudies)
#         self.route('PUT', ('annotation_studies',), self.putAnnotationStudies)
#         self.route('PUT', ('annotation_domains',), self.putAnnotationDomains)
#         self.route('GET', ('annotation_domains',), self.getAnnotationDomains)
#         self.route('GET', ('annotation_studies',), self.getAnnotationStudies)

#     @setting_utilities.validator('annotation_domain_list')
#     def _validateDefaultImage(doc):
#         if not isinstance(doc['value'], dict):
#             raise ValidationException('Annotation domain list must be a dictionary')

#     @setting_utilities.validator('annotation_study_list')
#     def _validateDefaultImage(doc):
#         if not isinstance(doc['value'], list):
#             x = 5
#             #raise ValidationException('Annotation study list must be a list')

#     @access.public
#     @filtermodel(model='annotator', plugin='dicom_annotator')
#     @autoDescribeRoute(
#         Description('Return the list of annotation domains')
#     )
#     def getAnnotationDomains(params):
#         return ModelImporter.model('setting').get('annotation_domain_list', default=[])

#     @access.public
#     @filtermodel(model='annotator', plugin='dicom_annotator')
#     @autoDescribeRoute(
#         Description('Load the list of annotation domains')
#     )
#     def putAnnotationDomains(params):
#         return ModelImporter.model('setting').set('annotation_domain_list', constants.PluginSettings.labelsDictionary)

#     @access.public
#     @filtermodel(model='annotator', plugin='dicom_annotator')
#     @autoDescribeRoute(
#         Description('Set the list of annotation studies')
#         .param('studies', 'The input of studies.', dataType='string', required=False)
#     )
#     def putAnnotationStudies(params):
#         return ModelImporter.model('setting').set('annotation_study_list', constants.PluginSettings.labelsList)
#     # def updateStudies(self, studies):
#     #     return ModelImporter.model('setting').set('annotation_study_list', studies)
#     #     #return ModelImporter.model('setting').set('annotation_study_list', constants.PluginSettings.labelsList)

#     @access.public
#     #@filtermodel(model='annotator', plugin='dicom_annotator')
#     @autoDescribeRoute(
#         Description('Get the list of annotation studies')
#     )
#     def getAnnotationStudies(params):
#         return ModelImporter.model('setting').get('annotation_study_list')


# def load(info):
#     info['apiRoot'].system = Annotator()
#     # info['apiRoot'].system.route('GET', ('annotation_domains',), getAnnotationDomains)
#     # info['apiRoot'].system.route('PUT', ('annotation_domains',), putAnnotationDomains)
#     # info['apiRoot'].system.route('PUT', ('annotation_studies',), updateStudies)
#     # info['apiRoot'].system.route('GET', ('annotation_studies',), getAnnotationStudies)


#**************************************
myStudies = []
@setting_utilities.validator('annotation_domain_list')
def _validateDefaultImage(doc):
    if not isinstance(doc['value'], dict):
        raise ValidationException('Annotation domain list must be a dictionary')

@setting_utilities.validator('annotation_study_list')
def _validateDefaultImage(doc):
    if not isinstance(doc['value'], list):
        x = 5
        # raise ValidationException('Annotation study list must be a list')

@access.public
@autoDescribeRoute(
    Description('Return the list of annotation domains')
)
def getAnnotationDomains(params):
    return ModelImporter.model('setting').get('annotation_domain_list', default=[])

@access.public
@autoDescribeRoute(
    Description('Load the list of annotation domains')
)
def putAnnotationDomains(params):
    return ModelImporter.model('setting').set('annotation_domain_list', constants.PluginSettings.labelsDictionary)

@access.public
@autoDescribeRoute(
    Description('Set the list of annotation studies')
    .param('studies', 'The input of studies.', dataType='string', required=False)
)
# def putAnnotationStudies(params):
#     return ModelImporter.model('setting').set('annotation_study_list', constants.PluginSettings.labelsList)
def updateStudies(studies):
    myStudies.append(studies)
    return ModelImporter.model('setting').set('annotation_study_list', myStudies)
    #return ModelImporter.model('setting').set('annotation_study_list', constants.PluginSettings.labelsList)

@access.public
@autoDescribeRoute(
    Description('Get the list of annotation studies')
)
def getAnnotationStudies(params):
    return ModelImporter.model('setting').get('annotation_study_list', default=[])


def load(info):
    info['apiRoot'].system.route('GET', ('annotation_domains',), getAnnotationDomains)
    info['apiRoot'].system.route('PUT', ('annotation_domains',), putAnnotationDomains)
    info['apiRoot'].system.route('PUT', ('annotation_studies',), updateStudies)
    info['apiRoot'].system.route('GET', ('annotation_studies',), getAnnotationStudies)
