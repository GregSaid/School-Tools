function calcular() {
    const totalAulas = parseInt(
        document.getElementById('total-aulas').value,
        10
    );
    const presencas = parseInt(document.getElementById('presencas').value, 10);
    const percentualMinimo = parseFloat(
        document.getElementById('percentual-minimo').value.replace(',', '.')
    );

    AprovadoBool = false;
    ReprovadoBool = false;
    OcultarAprovado();

    if (
        isNaN(totalAulas) ||
        isNaN(presencas) ||
        isNaN(percentualMinimo) ||
        totalAulas <= 0 ||
        presencas < 0 ||
        percentualMinimo <= 0 ||
        percentualMinimo > 100
    ) {
        ExibirErro('Por favor, insira valores válidos.');
        document.getElementById('resultado').innerText = '';
        return;
    }

    const percentualPresenca =
        totalAulas > 0 ? (presencas / totalAulas) * 100 : 0;
    const aprovado = percentualPresenca >= percentualMinimo;

    const presencaNecessaria = (percentualMinimo / 100) * totalAulas;
    const presencasNecessarias = Math.max(0, presencaNecessaria - presencas);
    const periodosNecessarios = Math.ceil(presencasNecessarias);

    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML =
        `<p><strong>Presença:</strong> ${percentualPresenca.toFixed(2)}%</p>` +
        (aprovado
            ? ''
            : `<p id="Small"><strong>Períodos necessários:</strong> ${periodosNecessarios}</p>`);

    resultadoDiv.className =
        'resultado ' + (aprovado ? 'aprovado' : 'reprovado');

    if (aprovado && !AprovadoBool) {
        Aprovado();
    } else if (!aprovado && AprovadoBool) {
        OcultarAprovado();
    }

    document.getElementById('erro').innerText = '';
}

let AprovadoBool = false;
let ReprovadoBool = false;

function Aprovado() {
    AprovadoBool = true;
    const inputs = document.querySelectorAll('input');
    inputs.forEach((input) => input.classList.add('green'));
    document.querySelector('.container').classList.add('green');
    document.querySelector('button').classList.add('green');
}

function OcultarAprovado() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach((input) => input.classList.remove('green'));
    document.querySelector('.container').classList.remove('green');
    document.querySelector('button').classList.remove('green');
    AprovadoBool = false;
}

function ExibirErro(mensagem) {
    if (erroBloqueado) return;
    erroBloqueado = true;
    document.querySelector('button').disabled = true;
    const erroElement = document.getElementById('erro');
    erroElement.innerText = mensagem || '';
    erroElement.classList.add('erro');

    const inputs = document.querySelectorAll('input');
    inputs.forEach((input) => input.classList.add('red'));
    document.querySelector('.container').classList.add('red');
    document.querySelector('button').classList.add('red');

    setTimeout(() => {
        OcultarErro();
        erroBloqueado = false;
    }, 5000);
}

function OcultarErro() {
    document.querySelector('button').disabled = false;
    const inputs = document.querySelectorAll('input');
    inputs.forEach((input) => input.classList.remove('red'));
    document.querySelector('.container').classList.remove('red');
    document.querySelector('button').classList.remove('red');
    document.getElementById('erro').innerText = '';
}

function OcultarResultado() {
    document.getElementById('resultado').innerText = '';
}

// Funções de validação
const maxvalor = 100;
const maxDigitos = 5;
const maxDecimais = 2;
let erroBloqueado = false;

function validarNumerosInteiros(campo) {
    campo.value = campo.value.replace(/[^0-9]/g, '');
}

function LimitarNumeros(campo) {
    let valor = campo.value.replace(',', '.');
    let partes = valor.split('.');
    if (partes.length > 2) {
        valor = partes.shift() + '.' + partes.join('');
        campo.value = valor;
    }
    if (partes[1] && partes[1].length > maxDecimais) {
        partes[1] = partes[1].slice(0, maxDecimais);
        valor = partes.join('.');
        campo.value = valor;
    }
    if (valor.length > maxDigitos) {
        campo.value = valor.slice(0, maxDigitos);
    }
}

function validarvalorMaximo(campo) {
    let valor = parseFloat(campo.value.replace(',', '.'));
    if (valor < 0) {
        campo.value = '';
        ExibirErro('Frequência não pode ser negativa. Corrigida para 0.');
    } else if (valor > maxvalor) {
        campo.value = maxvalor;
        ExibirErro(
            `Frequência corrigida para o máximo permitido de ${maxvalor}.`
        );
    } else {
        OcultarErro();
    }
}

function CheckChar(e) {
    const char = e.key;
    if (/[\d,.]/.test(char)) {
        return true;
    } else {
        e.preventDefault();
        return false;
    }
}

function atualizarPresencas() {
    validarPresencas();
}

function validarPresencas() {
    const totalAulas = parseInt(
        document.getElementById('total-aulas').value,
        10
    );
    const presencas = parseInt(document.getElementById('presencas').value, 10);
    if (!isNaN(totalAulas) && !isNaN(presencas) && presencas > totalAulas) {
        ExibirErro(
            'O número de presenças não pode ser maior que o número total de aulas.'
        );
        document.getElementById('presencas').value = totalAulas; // Corrige o valor das presenças
    } else {
        document.getElementById('erro').innerText = '';
        OcultarErro();
    }
}
