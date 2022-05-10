from setuptools import find_packages
from setuptools import setup

REQUIRED_PACKAGES = [
    'scikit-learn>=0.20.2',
    'numpy>=1.21.1',
    'sklearn~=0.0',
    'setuptools~=56.0.0',
    'google-api-core>=1.28.0',
    'google-cloud-storage>=1.40.0'
    'google-api-python-client>=1.10.0',
    'google-auth>=1.19.2',
    'google-auth-httplib2>=0.0.4',
    'google-cloud-core>=1.3.0',
    'google-cloud-trace>=0.23.0',
    'googleapis-common-protos>=1.52.0'
]

setup(
    name='trainer',
    version='0.1',
    install_requires=REQUIRED_PACKAGES,
    packages=find_packages(),
    include_package_data=True,
    description='My training application package.'
)
