# Frontend
ReactJS (+ einige Komponenten: react-burger-menu, react-day-picker, react-dom)
Bootstrap (Bibliothek für vereinfachten Umgang mit CSS)
moment (Bibliothek um das Arbeiten mit Datum und Uhrzeit zu vereinfachen)
axios (HTTP Client um Requests an den Backend-Server zu stellen)

## ReactJS
Eine Frontend Webseite mit React besteht aus einzelnen Komponenten, die nach Bedarf geladen und dynamisch verändert werden können. Diese Anwendung besteht aus selbst geschriebenen Komponenten und einigen fertigen, die als Node Pakete eingebunden werden (siehe Oben). Als Root-Element gilt App.js. Dort werden Komponenten eingebunden. Wenn nötig können diesen Komponenten sogenannte props mitgegeben werden. Dies sind Variablen auf die sowohl das Parent- als auch das Child-Element Zugriff haben. Mehr zu Komponenten und Props:
https://reactjs.org/docs/components-and-props.html

### App.js
Fügt alle Komponenten zusammen und verfügt über die States aller Filteroptionen. 

	this.state = {
	      isReserved: undefined,
	      hasPC: undefined,
	      location: undefined,
	      startDate: moment.utc(Date.now()).format("YYYY/MM/DD"),
	      endDate: moment.utc(Date.now()).format("YYYY/MM/DD"),
	      search: "",
	      showModal: false,
	      workplace: undefined
	}

Alle States werden dann als props den zugehörigen Komponenten mitgegeben, wo mit diesen gearbeitet wird und mit deren Hilfe bestimmte Dinge dargestellt werden. Zum Beispiel werden die props *isReserved*, *hasPC*, *location*, *startDate*, *endDate* und *search* der Komponente *WorkplaceListComponent* übergeben. Diese dient der Darstellung aller angeforderten Arbeitsplätze. 

Als anderes Beispiel gibt es noch die Methoden *updateFilter*, *updateSearch* und *selectedDays*. Diese Methoden werden Komponenten als props übergeben und können dann von diesen aufgerufen werden und Parameter übergeben. So kann z.B. die *CalendarView*-Komponente das aktuell ausgewählte Start- und Enddatum mit Hilfe der Methode *selectedDays* an die App-Komponente weiterleiten. Dort werden diese Daten dann wiederum in den State gespeichert, welcher von der *WorkplaceListComponent* zur Darstellung genutzt wird.

