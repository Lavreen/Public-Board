# Public-Board
For android app inside PublicBoard folder
```
npm ci
npx react-native run-android
```


For server inside django folder
```
pip install -r code/requirements.txt
python code/manage.py makemigrations
python code/manage.py migrate
python code/manage.py createsuperuser
python code/manage.py runserver
```

If docker container is used instad last command run
```
docker-compose build
docker-compose up
```