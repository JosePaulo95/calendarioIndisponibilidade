
const dias_semana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
var dias_marcados = [];

var mouseDown = false;
document.body.onmousedown = function() { 
	mouseDown = true;
}
document.body.onmouseup = function() {
	mouseDown = false;
}
function marcarDiaSemana(dia_semana_desejado, index_mes, ano){
	var primeiro_dia_mes = getPrimeiroDiaMes(index_mes, ano);
	var primeiro_dia_coluna = caminharAteEncontrarDiaNaColuna(primeiro_dia_mes, dia_semana_desejado);
	var index_ultimo_dia_mes = getIndexUltimoDiaMes(index_mes, ano);

	var estao_dias_td_marcados_ = estaColunaTodaMarcada(primeiro_dia_coluna, index_ultimo_dia_mes);

	if(estao_dias_td_marcados_){
		disponibilizarColuna(primeiro_dia_coluna, index_ultimo_dia_mes);
	}else{
		indisponibilizarColuna(primeiro_dia_coluna, index_ultimo_dia_mes);
	}
}
function caminharAteEncontrarDiaNaLinha(primeiro_dia_mes, index_semana) {
	var counts_segundas_feiras = 0;
	var data_pivo = new Date(primeiro_dia_mes);

	if(index_semana == 0){
		return primeiro_dia_mes;
	}

	while(counts_segundas_feiras != index_semana){
		data_pivo.setDate(data_pivo.getDate() + 1);
		if(data_pivo.getDay() == 1){
			counts_segundas_feiras++;
		}
	}
	return data_pivo;
}
function ehSegundaFeira(d) {
	return (d.getDay() == 1);
}
function estaLinhaTodaMarcada(aux_date, index_limite) {
	var estao_dias_td_marcados_ = true;
	for (var i = 0;aux_date.getDate()+i <= index_limite; i++) {
		if(!dias_marcados.includes(formatDate(aux_date, i))){//checa se dia esta disponivel
			estao_dias_td_marcados_ = false;
		}
	}
	return estao_dias_td_marcados_;
}
function disponibilizarLinha(data_pivo, index_limite) {
	while(data_pivo.getDate() < index_limite){	
		if(dias_marcados.includes(formatDate(data_pivo, 0))){//esse check aqui é importante p n add 2x
			disponibilizar(formatDate(data_pivo, 0));
		}
		data_pivo.setDate(data_pivo.getDate()+1);
	}
	if(dias_marcados.includes(formatDate(data_pivo, 0))){//esse check aqui é importante p n add 2x
		disponibilizar(formatDate(data_pivo, 0));
	}
}
function indisponibilizarLinha(data_pivo, index_limite) {
	while(data_pivo.getDate() < index_limite){	
		if(!dias_marcados.includes(formatDate(data_pivo, 0))){//esse check aqui é importante p n add 2x
			indisponibilizar(formatDate(data_pivo, 0));
		}
		data_pivo.setDate(data_pivo.getDate()+1);
	}
	if(!dias_marcados.includes(formatDate(data_pivo, 0))){//esse check aqui é importante p n add 2x
		indisponibilizar(formatDate(data_pivo, 0));
	}
}
function marcarSemana(index_semana, index_mes, ano){
	var primeiro_dia_mes = getPrimeiroDiaMes(index_mes, ano);
	var primeiro_dia_linha = caminharAteEncontrarDiaNaLinha(primeiro_dia_mes, index_semana);
	var index_ultimo_dia_mes = getIndexUltimoDiaMes(index_mes, ano);
	var index_ultimo_dia_linha = getIndexUltimoDiaLinha(primeiro_dia_linha, index_ultimo_dia_mes);
	var estao_dias_td_marcados_ = estaLinhaTodaMarcada(primeiro_dia_linha, index_ultimo_dia_linha);

	console.log(index_ultimo_dia_linha);

	if(estao_dias_td_marcados_){
		disponibilizarLinha (primeiro_dia_linha, index_ultimo_dia_linha);
	}else{
		indisponibilizarLinha (primeiro_dia_linha, index_ultimo_dia_linha);
	}
}
//retorna o obj Date 1º de Janeiro de 2018 ex
function getPrimeiroDiaMes(index_mes, ano) {
	return new Date("20"+ano, index_mes-1, 1);
}
//retorna o obj Date 1º de Janeiro de 2018 ex
function getIndexUltimoDiaMes(index_mes, ano) {
	var aux_str = "20"+ano+"-"+index_mes+"-02";//pega 1o dia no mês desse dia da semana<
	var d = new Date(aux_str);	
	d.setMonth(d.getMonth()+1);
	d.setDate(0);
	return d.getDate();
}
function getIndexUltimoDiaLinha(primeiro_dia_linha, index_ultimo_dia_mes){
	var d = new Date(primeiro_dia_linha);
	while(d.getDay() != 0 && d.getDate() < index_ultimo_dia_mes){
		d.setDate(d.getDate()+1);
	}
	return d.getDate();
} 
//avança nos dias a partir de uma data ate encontrar a primeira "quarta" (ex). Não foi feita para funcionar entre 2 meses
function caminharAteEncontrarDiaNaColuna(data_pivo, dia_semana_desejado) {
	dia_semana_desejado++;//pq ele começar de segunda
	dia_semana_desejado = dia_semana_desejado%7;//p n extrapolar fazendo 7=0
	while(data_pivo.getDay() != dia_semana_desejado){
		data_pivo.setDate(data_pivo.getDate() + 1);
	}
	console.log("pd: "+data_pivo.getDay()+" dia_semana_desejado: "+dia_semana_desejado);
	return data_pivo;
}
function estaColunaTodaMarcada(aux_date, index_ultimo_dia_mes) {
	//se todos os dias estão marcados então ele deve disponibilizar todos, mas se tem só um disponivel, o botão deve servir pra marcar todos
	var estao_dias_td_marcados_ = true;

	for (var i = 0; (aux_date.getDate()+i)<=index_ultimo_dia_mes; i+=7) {
		if(!dias_marcados.includes(formatDate(aux_date, i))){//checa se dia esta disponivel
			estao_dias_td_marcados_ = false;
		}
	}
	return estao_dias_td_marcados_;
}
function disponibilizarColuna(aux_date, index_ultimo_dia_mes){
	for (var i = 0; (aux_date.getDate()+i)<=index_ultimo_dia_mes; i+=7) {
		if(dias_marcados.includes(formatDate(aux_date, i))){
			disponibilizar(formatDate(aux_date, i));
		}
	}
}
function indisponibilizarColuna(aux_date, index_ultimo_dia_mes){
	for (var i = 0; (aux_date.getDate()+i)<=index_ultimo_dia_mes; i+=7) {
		if(!dias_marcados.includes(formatDate(aux_date, i))){
			indisponibilizar(formatDate(aux_date, i), i);
		}
	}
}
function formatDate(date, passo) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + (d.getDate()+passo),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}
function marcarDiaClick(id){
	if(dias_marcados.includes(id)){
		disponibilizar(id);	
	}else{
		indisponibilizar(id);
	}
}
function indisponibilizar(id, delay=0) {
	var elm = document.getElementById(id);
	dias_marcados.push(id);

	setInterval(frame, 5);
	var i = 0;
	var r_alvo = 215;
	var g_alvo = 107;
	var b_alvo = 107;

	var r_ini = 150;
	var g_ini = 50;
	var b_ini = 50;

	var r_passo = (r_ini-r_alvo)/100;
	var g_passo = (g_ini-g_alvo)/100;
	var b_passo = (b_ini-b_alvo)/100;

	function frame() {
	    if (i>100) {
	        clearInterval(id);
	    } else {
	    	delay-=1.5;
	    	if(delay <= 0){
	    		i++;
	    		if(dias_marcados.includes(id)){
	    			elm.style.backgroundColor = "rgb("+(r_ini-(i*r_passo))+","+(g_ini-(i*g_passo))+","+(b_ini-(i*b_passo))+")";
	    		}else{
	    			clearInterval(id);
	    		}
	    	}
	    }
	}
	//elm.style.backgroundColor = "rgb(215, 107, 107)";
}

function disponibilizar(id) {
	var elm = document.getElementById(id);
	let index = dias_marcados.indexOf(id);
	dias_marcados.splice(index, 1);
	elm.style.backgroundColor = "rgb(247,247,247)";
}
function marcarDia(id){
	if(mouseDown){
		if(dias_marcados.includes(id)){
			document.getElementById(id).style.backgroundColor = "#F7F7F7";
			let index = dias_marcados.indexOf(id);
			dias_marcados.splice(index, 1);
		}else{
			document.getElementById(id).style.backgroundColor = "#D76B6B";
			dias_marcados.push(id);
		}
	}
}
function changeMonth(id_antigo, id_novo){
	if(id_novo != "calendar-1" && id_novo != "calendar12"){
		document.getElementById(id_antigo).style.display = "none";
		document.getElementById(id_novo).style.display = "block";
	}
}

/*
setInterval(frame, 5);
	var i = 0;
	var r_alvo = 215;
	var g_alvo = 107;
	var b_alvo = 107;

	var r_ini = 200;
	var g_ini = 50;
	var b_ini = 50;

	var r_passo = (r_ini-r_alvo)/100;
	var g_passo = (g_ini-g_alvo)/100;
	var b_passo = (b_ini-b_alvo)/100;

	function frame() {
	    if (i>100) {
	        clearInterval(id);
	    } else {
	    	delay-=1.5;
	    	if(delay <= 0){
	    		i++;
	    		if(dias_marcados.includes(id)){
	    			elm.style.backgroundColor = "rgb("+(r_ini-(i*r_passo))+","+(g_ini-(i*g_passo))+","+(b_ini-(i*b_passo))+")";
	    		}else{
	    			clearInterval(id);
	    		}
	    	}
	    }
	}
*/