# BWB - Raumplaner IT
Autor: Lennard Grimm


## 1. Technologien

MERN Stack - **M**ongoDB **E**xpress **R**eactJS **N**odeJS

### 1.1 Installation

Es wird nodejs (+npm) und der mongodb Client benötigt. Alle node_modules können durch die in package.json angegeben Abhängigkeiten automatisch installiert werden.


## 2. Starten der Anwendung

Datenbank starten

	mongod
	
Backend starten (localhost:5000)

	npm run backend
	
Frontend starten (localhost:3000)

	npm run frontend

Frontend und Backend starten

	npm run dev
	
## 3.Aufbau

>backend
>>*app.js* (das Herzstück, hier wird alles zusammengeführt und der Server gestartet)  
>>*models* (die Datenmodelle)  
>>*routes* (die abrufbaren Routen)  
>>*test* (zum Testen einzelner Requests z.B. mit mocha)  
>>*node_modules*  

>frontend
>>*public* (beinhaltet unter anderem die index.html als Root der Seite)  
>>*src* (beinhaltet die .jsx Komponenten)  
>>*node_modules*  
