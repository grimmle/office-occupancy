# Backend
mongoose (für Datenmodellierung)  
express (Web-Framework für die Erstellung von APIs)  
cors (erlaubt Anfragen von anderen Domains auf eingeschränkte Ressourcen)  
moment  (Bibliothek um das Arbeiten mit Datum und Uhrzeit zu vereinfachen)  

## 1. Datenmodelle
**Workplace:**
stellt einen einzelnen Arbeitsplatz dar. Dieser beinhaltet alle notwendigen Informationen und seine zugehörigen Belegungen. Die eindeutige _id für einen Arbeitsplatz muss bei einem POST mitgegeben werden. Sie setzt sich aus der Raumnummer und einem Buchstaben pro Arbeitsplatz zusammen (z.B. 4407A, 4407B, 3508B).
	
	const mongoose = require("mongoose");
	const Employee = require("./employee.model");
	const Schema = mongoose.Schema;

	const Workplace = new Schema(
	  {
	    _id: {
	      type: String,
	      required: true
	    },
	    location: {
	      type: String,
	      required: true
	    },
	    hasPC: {
	      type: Boolean,
	      required: true
	    },
	    reservations: [
	      { startDate: {
		type: Date,
		default: undefined
	      },
	      endDate: {
		type: Date,
		default: undefined
	      },
	      employee: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Employee",
		default: undefined
	      },
	      note: {
		type: String,
		default: ""
	      }
	    }
	  ],
	}
	);

	module.exports = mongoose.model("Workplace", Workplace);


**Employee:** 
stellt einen Mitarbeiter dar. Ein Mitarbeiter bekommt bei der Erstellung automatisch von MongoDB eine eindeutige _id zugeordnet.

	const mongoose = require("mongoose");
	const Schema = mongoose.Schema;

	const Employee = new Schema(
	  {
	    firstName: {
	      type: String,
	      required: true
	    },
	    lastName: {
	      type: String,
	      required: true
	    },
	  }
	);

	module.exports = mongoose.model("Employee", Employee);

## 2. Routen

Es gibt für die beiden Datenmodelle je eine Route um REST Aufrufe daran auszuführen:


### URL/workplaces
**GET** gibt alle Arbeitsplätze zurück (optional mit Filter und Sortierung). Werden keine Arbeitsplätze mit den angegebenen Filtern gefunden, wird ein leeres Array zurückgegeben. Filter und Sortierungen können in der URL mit einem ? und dem gewünschten Parameter angehangen werden z.B.

	/workplaces?sort=location:1	
(sortiert die Arbeitsplätze aufsteigend nach dem Standort). 
Standardmäßig werden die Arbeitsplätze aufsteigend nach ihrer _id sortiert. Mehrere Parameter werden mit einem & konkateniert z.B.

	/workplaces?hasPC=true&location=Hohenzollerndamm
So können beliebig viele Filter und Sortierung angewandt werden. 
Außerdem wurde ein ‘search’-Parameter eingebaut der mittels eines regulären Ausdrucks alle Arbeitsplätze herausfiltert in deren _id der Suchbegriff vorkommt z.B. 

	/workplaces?search=4 
liefert alle Arbeitsplätze deren _id eine 4 enthält. 
Weiterhin können auch Arbeitsplätze und deren Belegungen in einem bestimmten Zeitraum angezeigt werden. Durch Angabe eines Datums im Format YYYY/MM/DD kann ein startDate und endDate als Query-Parameter übergeben werden. Nun werden alle Arbeitsplätze bzw. deren Belegungen nach Überlappungen mit dem angegebenen Zeitraum durchsucht. Ausgegeben werden Arbeitsplätze mit keinen Belegungen in diesem Zeitraum und Arbeitsplätze die in diesem Zeitraum bereits belegt sind. z.B.

	/workplaces?startDate=2019/07/01&endDate=2019/07/08
filtert nach dem Zeitraum 01.07.2019 - 08.07.2019. 
Durch Übergabe des Query-Parameters isReserved=false werden nur noch Arbeitsplätze ausgegeben, die im angegebenen Zeitraum frei sind.

**POST** fügt einen neuen Arbeitsplatz hinzu.
Benötigt werden die Parameter _id (String), location (String) und hasPC (Boolean). Ein neuer Arbeitsplatz hat ein leeres Array an Belegungen.

---
### URL/workplaces/:id
**GET** gibt, wenn vorhanden, den Arbeitsplatz mit der _id zurück.

	/workplaces/4407A
**PATCH** ermöglicht es die Parameter location und hasPC des Arbeitsplatzes mit zugehöriger _id zu ändern. Im Body der PATCH-Request kann einer oder beide Parameter mit neuen Werten übergeben werden.

**DELETE** löscht den Arbeitsplatz mit übergebener _id.

---
### URL/workplaces/:id/reservations
**GET** gibt alle Belegungen eines Arbeitsplatzes aus.

**POST** fügt einem Arbeitsplatz mit der _id eine neue Belegung hinzu. Benötigt werden im Request Body die Parameter: startDate (String, YYYY/MM/DD), endDate (String, YYYY/MM/DD) und employee (String, mittels einer ObjectId). Optional kann einer Belegung mit dem Parameter note (String) eine Notiz hinzugefügt werden.
	
---
### URL/workplaces/:id/reservations/:rid
**GET** gibt die Belegung mit :rid des Arbeitsplatzes mit :id zurück. Die :rid ist eine von MongoDB erzeugte ObjectId. z.B.

	/workplaces/4407A/reservations/507f191e810c19729de860ea
**PATCH**  ermöglicht es, eine Belegung zu bearbeiten (Nicht ausreichend getestet). Durch Übergabe einzelner Parameter im Request Body können diese verändert werden.

**DELETE** löscht die Belegung mit :rid.

---
### URL/employees (bisher nur zum Testen eingerichtet)
**GET** gibt alle Mitarbeiter zurück.

**POST** fügt einen neuen Mitarbeiter hinzu. Benötigt werden firstName(String) und lastName(String).
