"""Contains the logic used to configure the logging file"""

import logging
import logging.config

# Formatters
console_formatter = {"console_formatter": {"format:": "%(levelname)s - %(message)s"}}
file_formatter = {"file_formatter": {"format": "%(levelname)s %(filename)s:%(lineno)d - %(message)s"}}

# Handlers
console_handler = {"console_handler": {"formatter": "console_formatter", "class": "logging.StreamHandler"}}
file_handler = {"file_handler": {"formatter": "file_formatter", "class": "logging.FileHandler", "filename": "output.log", "mode": "w"}}

# Loggers
info_logger = {"": {"handlers": ["console_handler"], "level": "INFO", "propagate": "False"}}
debug_logger = {"": {"handlers": ["console_handler"], "level": "DEBUG", "propagate": "False"}}
file_nonverbose_logger = {"": {"handlers": ["console_handler", "file_handler"], "level": "INFO", "propagate": "False"}}
file_verbose_logger = {"": {"handlers": ["console_handler", "file_handler"], "level": "DEBUG", "propagate": "False"}}

# Full Logger Objects
STANDARD_LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": console_formatter,
    "handlers": console_handler,
    "loggers": info_logger,
}
VERBOSE_LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": console_formatter,
    "handlers": console_handler,
    "loggers": debug_logger,
}
FILE_LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {**console_formatter, **file_formatter},
    "handlers": {**console_handler, **file_handler},
    "loggers": file_nonverbose_logger,
}
VERBOSE_FILE_LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {**console_formatter, **file_formatter},
    "handlers": {**console_handler, **file_handler},
    "loggers": file_verbose_logger,
}

def configure_logging(*, verbose: bool = False, file_logging = False) -> None:
    """Used to configure the logging file"""
    if verbose and file_logging:
        logging.config.dictConfig(VERBOSE_FILE_LOGGING)
    elif verbose:
        logging.config.dictConfig(VERBOSE_LOGGING)
    elif file_logging:
        logging.config.dictConfig(FILE_LOGGING)
    else:
        logging.config.dictConfig(STANDARD_LOGGING)
