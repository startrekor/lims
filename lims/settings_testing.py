# Django settings for 1km project

try:
    from settings import *
except ImportError:
    import sys
    print >>sys.stderr, '''Settings not defined.  Please configure a version of
    settings.py for this site.'''
    del sys
    
import os.path


print 'PROJECT_ROOT: ', PROJECT_ROOT, ', ' , os.path.join(PROJECT_ROOT, '..')


# make tests faster
# use from the command line with testing like
# ./manage.py test --settings=lims.testing-settings
SOUTH_TESTS_MIGRATE = False

# FIXME: sqllite3 db does not work - errors on "DISTINCT ON" clause
# DATABASES['default'] = {'ENGINE': 'django.db.backends.sqlite3',
#                         'NAME': ':memory'}

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '%(levelname)s %(asctime)s %(module)s:%(lineno)d %(process)d %(thread)d %(message)s'
        },
        'simple': {
            'format': '%(levelname)s %(msecs)s: %(name)s:%(funcName)s:%(lineno)d: %(message)s'
        },
    },
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        }
    },
    'handlers': {
        'logfile': {
            'level':'DEBUG',
            'class':'logging.handlers.RotatingFileHandler',
            'filename': os.path.join(PROJECT_ROOT, '..') +  "/logs/iccbl-testing.log",
            'maxBytes': 5000000,
            'backupCount': 2,
            'formatter': 'simple',
        },
        'console':{
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'simple'
        },  
    },
    'loggers': {
#         '': {
#             'handlers': ['console'],
#             'propagate': False,
#             'level': 'INFO',
#         },
        'django.request': {
            'handlers': ['logfile'],
            'level': 'ERROR',
            'propagate': False,
        },
        'db': {  # set a default handler
            'handlers': ['logfile'],
            'propagate': False,
            'level': 'INFO',
        },        
        'lims': {  # set a default handler
            'handlers': ['logfile'],
            'propagate': False,
            'level': 'INFO',
        },               
        'reports': {  # set a default handler
            'handlers': ['logfile'],
            'propagate': True,
            'level': 'INFO',
        },
        'db.tests': {  # set a default handler
            'handlers': ['console'],
            'propagate': False,
            'level': 'INFO',
        },        
        'lims.tests': {  # set a default handler
            'handlers': ['console'],
            'propagate': False,
            'level': 'INFO',
        },               
        'reports.tests': {  # set a default handler
            'handlers': ['console'],
            'propagate': False,
            'level': 'INFO',
        },        
        'django': {  # set a default handler
            'handlers': ['logfile'],
            'propagate': False,
            'level': 'INFO',
        },        
        'utils': {  # for SQL
            'handlers': ['logfile'],
            'propagate': True,
            'level': 'INFO',
        },        
        'tastypie': {  # set a default handler
            'handlers': ['logfile'],
            'propagate': False,
            'level': 'INFO',
        },        
    }
}
