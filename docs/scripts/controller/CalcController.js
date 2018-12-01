class CalcController {

	constructor() {

		this._lastOperator = '';
		this._lastNumber = '';

		this._locale = "pt-BR";

		this._operation = [];
		this._displayCalcEl = document.querySelector("#display");
		this._dateEl = document.querySelector("#data");
		this._timeEl = document.querySelector("#hora");


		this._currentDate;
		this.initialize();
		this.initButtonsEvents();
		this.initKeyboard();
	}

	initialize() {

		this.setDisplayDateTime();

		//Função para modificar Data e Hora dinamicamente
		setInterval(() => {
			this.setDisplayDateTime();
		}, 1000);

		this.setLastNumberToDisplay();
	}

	pushOperation(value) {
		this._operation.push(value);

		if (this._operation.length > 3) {
			this.calc();
		}
	}

	getResult() {
		return eval(this._operation.join(""));
	}

	calc() {
		let last = '';
		this._lastOperator = this.getLastItem();

		if (this._operation.length < 3) {
			let firstItem = this._operation[0];
			this._operation = [firstItem, this._lastOperator, this._lastNumber];
		}

		if (this._operation.length > 3) {
			last = this._operation.pop();
			this._lastNumber = this.getResult();

		} else if (this._operation.length == 3) {

			this._lastNumber = this.getLastItem(false);
		}

		let result = this.getResult();

		if (last == '%') {
			result /= 100;
			this._operation = [result];
		} else {
			this._operation = [result];

			if (last) this._operation.push(last);
		}


		this.setLastNumberToDisplay();
	}

	setLastOperation(value) {
		this._operation[this._operation.length - 1] = value;
	}

	//Pega ultimo elemonto do Array
	getLastOperation() {
		return this._operation[this._operation.length - 1];
	}

	clearAll() {
		//Limpa a lista de itens
		this._operation = [];
		this._lastNumber = '';
		this._lastOperator = '';

		this.setLastNumberToDisplay();
	}
	clearEntry() {
		//Elimina o ultimo item da lista
		this._operation.pop();

		this.setLastNumberToDisplay();
	}
	setError() {
		//Mostra no Display o nome ERRO
		this.displayCalc = "Error";
	}

	isOperator(value) {
		//verifica se o valor informado esta dentro deste array
		return (['+', '-', '*', '%', '/'].indexOf(value) > -1);
	}

	addOperation(value) {

		//Valida se o ultimo item da lista é um numero
		if (isNaN(this.getLastOperation())) {

			//Valida o ultimo item e verifica qual foi digitado
			if (this.isOperator(value)) {
				//Troca o operador anterior
				this.setLastOperation(value);
			} else {
				this.pushOperation(value);

				this.setLastNumberToDisplay();
			}

		} else {

			if (this.isOperator(value)) {
				this.pushOperation(value);
			} else {
				//transforma o numero anterior e o digitado em string e concatena
				let newValue = this.getLastOperation().toString() + value.toString();
				this.setLastOperation(newValue);

				this.setLastNumberToDisplay();
			}
		}

	}

	getLastItem(isOperator = true) {
		let lastItem;

		for (let i = this._operation.length - 1; i >= 0; i--) {
			if (this.isOperator(this._operation[i]) == isOperator) {
				lastItem = this._operation[i];
				break;
			}
		}

		if (!lastItem) {
			lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
		}

		return lastItem;

	}

	setLastNumberToDisplay() {

		let lastNumber = this.getLastItem(false);

		if (!lastNumber) lastNumber = 0;
		this.displayCalc = lastNumber;
	}

	addDot() {
		let lastOperation = this.getLastOperation();

		if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;

		if (this.isOperator(lastOperation) || !lastOperation) {
			this.pushOperation('0.');
		} else {
			this.setLastOperation(lastOperation.toString() + '.');
		}

		this.setLastNumberToDisplay();
	}

	copyToClipboard(){
		let input = document.createElement('input');

		input.value = this.displayCalc;

		document.body.appendChild(input);
		input.select();
		document.execCommand('Copy');

		input.remove();
	}

	initKeyboard() {
		document.addEventListener('keyup', e => {
			switch (e.key) {
				case "Escape":
					this.clearAll();
					break;
				case "Backspace":
					this.clearEntry();
					break;
				case "+":					
				case "-":
				case "/":
				case "*":
				case "%":
					this.addOperation(e.key);
					break;
				case "Enter":
				case "=":
					this.calc();
					break;

				case ".":
				case ",":
					this.addDot();
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
					this.addOperation(parseInt(e.key));
					break;

				case 'c':
					if(e.ctrlKey) this.copyToClipboard();
					break;
			}
		});
	}

	execBtn(value) {
		switch (value) {
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
				this.calc();
				break;

			case "ponto":
				this.addDot();
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
	addEventListenerAll(element, events, fn) {
		events.split(' ').forEach(event => {
			element.addEventListener(event, fn, false);
		});
	}

	initButtonsEvents() {
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
	setDisplayDateTime() {
		this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
			day: "2-digit",
			month: "long",
			year: "numeric"
		});
		this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
	}

	get displayCalc() {
		return this._displayCalcEl.innerHTML;
	}

	set displayCalc(value) {
		this._displayCalcEl.innerHTML = value;
	}

	get currentDate() {
		return new Date();
	}

	set currentDate(value) {
		this._currentDate = value;
	}

	get displayDate() {
		return this._dateEl.innerHTML;
	}

	set displayDate(value) {
		this._dateEl.innerHTML = value;
	}

	get displayTime() {
		return this._timeEl.innerHTML;
	}

	set displayTime(value) {
		this._timeEl.innerHTML = value;
	}
}