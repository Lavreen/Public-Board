# django_tutorial
The end of the Django official tutorial, setup for PyCharm Professional demos

## Installation

1. Clone this repo, open in PyCharm Professional, which should:
   - Make a virtual environment
   - Prompt to install dependencies from `requirements.txt`
   - Configure the settings that recognize this as a Django project
   - Make a Django run configuration
2. if you have problems accessing the database use the following commands:
   - `chown $USER /code`
   - `chown $USER /code/db.sqlite`
3. Open PyCharm's `manage.py` console via `Tools | Run manage..py task`
4. `makemigrations` and press enter
5. `migrate` and press enter
6. `createsuperuser` (and answer the questions)
7. Run the created run config (probably named `django_tutorial`)
8. Visit `http://127.0.0.1:8000/admin/` for admin panel
9. Visit `http://127.0.0.1:8000/app_messages/` for user panel
