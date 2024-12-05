# TraderInfo Project
##Steps to Run the Project
1. Clone the github repository onto your local machine
2. Download Docker Desktop https://docs.docker.com/desktop/setup/install/windows-install/
4. In the root directory of the TraderInfo project, create a .env file
5. Paste in the required keys and secrets (MONGO_USER, DJANGO_SECRET, MONGO_PASS, ALPHA_API) (These will have to be privately sent to you)
6. Run 'docker compose up --build' in the terminal at the root directory of the project while docker desktop is running in the background
7. Navigate to localhost urls produced by the terminal (localhost:3000 is for frontend, localhost:8000/api/docs is for backend)
8. THE API HAS A LIMIT OF 25 REQUESTS A DAY, SO IF IT STOPS WORKING THAT IS WHY
