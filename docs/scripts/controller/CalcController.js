class CalcController{

	constructor(){

		this._locale = "pt-BR";

		this._operation = [];
		this._displayCalcEl = document.querySelector("#display");
		this._dateEl        = document.querySelector("#data");
		this._timeEl 	    = document.querySelector("#hora");


		this._currentDate;
		this.initialize();
		this.initButtonsEvents();
	}

	initialize(){

		this.setDisplayDateTime();
		
		//Função para modificar Data e Hora dinamicamente
		setInterval(() => {
			this.setDisplayDateTime();	
		}, 1000);
	}

	setLastOperation(value){
		this._operation[this._operation.length -1] = value;
	}

	//Pega ultimo elemonto do Array
	getLastOperation(){
		return this._operation[this._operation.length -1];
	}

	clearAll(){
		//Limpa a lista de itens
		this._operation = [];
	}
	clearEntry(){
		//Elimina o ultimo item da lista
		this._operation.pop();
	}
	setError(){
		//Mostra no Display o nome ERRO
		this.displayCalc = "Error";
	}

	isOperator(value){
		//verifica se o valor informado esta dentro deste array
		return (['+', '-', '*', '%', '/'].indexOf(value) > -1);
	}

	addOperation(value){

		console.log("A", isNaN(this.getLastOperation()));

		//Valida se o ultimo item da lista é um numero
		if(isNaN(this.getLastOperation())){
			
			//Valida o ultimo item e verifica qual foi digitado
			if(this.isOperator(value)){
				//Troca o operador anterior
				this.setLastOperation(value);
			}else if(isNaN(value)){
				console.log(value);
			}else{
				this._operation.push(value);
			}

		} else{
			//transforma o numero anterior e o digitado em string e concatena
			let newValue = this.getLastOperation().toString() + value.toString();
			this.setLastOperation(parseInt(newValue));
		}

		//Adiciona um item na lista
		//this._operation.push(value);

		console.log(this._operation);
	}

	execBtn(value){
		switch (value){
			case "ac":
				this.clearAll();
				break;
			case "ce":
				this.clearEntry();
				break;
			case "soma":
				this.addOperation("+");
				break;
			case "subtracao":
				this.addOperation("-");
				break;
			case "divisao":
				this.addOperation("/");
				break;
			case "multiplicacao":
				this.addOperation("*");
				break;
			case "porcento":
				this.addOperation("%");
				break;
			case "igual":
				
				break;	

			case "ponto":
				this.addOperation(".");
				break;	
	
				
			case "0":
			case "1":
			case "2":
			case "3":
			case "4":
			case "5":
			case "6":
			case "7":
			case "8":
			case "9":
				this.addOperation(parseInt(value));
				break;

			default:
				this.setError();
				break;						
		}
	}
	//Cria uma lista de eventos a ser executada
	addEventListenerAll(element, events, fn){
		events.split(' ').forEach(event => {
			element.addEventListener(event, fn, false);
		});
	}

	initButtonsEvents(){
		let buttons = document.querySelectorAll("#buttons > g, #parts > g");

		buttons.forEach((btn, index) => {

			this.addEventListenerAll(btn, 'click drag', e => {
				let textBtn = btn.className.baseVal.replace("btn-", "");

				this.execBtn(textBtn);
			});

			this.addEventListenerAll(btn, "mouseover mouseup mousedown", e => {
				btn.style.cursor = "pointer";	
			});

		})
	}

	//Metodo para pegar Data e Hora do sistema
	setDisplayDateTime(){
		this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
			day: "2-digit",
			month: "long",
			year: "numeric"
		});
		this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
	}

	get displayCalc(){
		return this._displayCalcEl.innerHTML; 
	}

	set displayCalc(value){
		this._displayCalcEl.innerHTML = value;
	}

	get currentDate(){ 
		return new Date(); 
	}

	set currentDate(value){
		this._currentDate = value;
	}

	get displayDate(){
		return this._dateEl.innerHTML;
	}

	set displayDate(value){
		this._dateEl.innerHTML = value;
	}

	get displayTime(){
		return this._timeEl.innerHTML;
	}
 
	set displayTime(value){
		this._timeEl.innerHTML = value;
	}
}