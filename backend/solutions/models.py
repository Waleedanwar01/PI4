from resources.models import (
    SolutionPage,
    SolutionImage,
    SolutionConsultant,
    ServiceOffering,
    ServiceButton,
    SolutionVideo,
    IndustryItem,
)


class SolutionPageProxy(SolutionPage):
    class Meta:
        proxy = True
        verbose_name = 'Solution Page'
        verbose_name_plural = 'Solution Pages'


class SolutionImageProxy(SolutionImage):
    class Meta:
        proxy = True
        verbose_name = 'Image'
        verbose_name_plural = 'Images'


class SolutionConsultantProxy(SolutionConsultant):
    class Meta:
        proxy = True
        verbose_name = 'Consultant'
        verbose_name_plural = 'Consultants'


class ServiceOfferingProxy(ServiceOffering):
    class Meta:
        proxy = True
        verbose_name = 'Consulting Service'
        verbose_name_plural = 'Consulting Services'


class ServiceButtonProxy(ServiceButton):
    class Meta:
        proxy = True
        verbose_name = 'Button'
        verbose_name_plural = 'Buttons'


class SolutionVideoProxy(SolutionVideo):
    class Meta:
        proxy = True
        verbose_name = 'Video'
        verbose_name_plural = 'Videos'


class IndustryItemProxy(IndustryItem):
    class Meta:
        proxy = True
        verbose_name = 'Industry'
        verbose_name_plural = 'Industries'
