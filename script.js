const canva = document.getElementById('grafico');

const function_x = (xn) => {
    let select = document.getElementById('tipoFuncion').value;
    if (select == 'sin') return Math.sin(xn);
    if (select == 'cos') return Math.cos(xn);
    if (select == 'tan') return Math.sin(xn) / Math.cos(xn);
};

const au = document.getElementById('formulario');
const deslis = au.querySelectorAll('input[type="range"]');
const valor = document.getElementById('valor-amplitud');
const ini = document.getElementById('inicio');
const fin = document.getElementById('final');
const btn = document.getElementById('ahhhh');
const amp = document.getElementById('amplitud');
const altini = document.getElementById('alturaInicio');

let graficado = false; 

function obtenerDatos() {
    const pi = Math.PI;
    let inicio = ini.value ? parseFloat(ini.value) : 0;
    let finalVal = fin.value ? parseFloat(fin.value) : 2 * pi;
    
    if (inicio >= finalVal) {
        alert('El valor de inicio debe ser menor que el valor final, BOBITO.');
        return null;
    }
    let cantidad_puntos = parseInt(deslis[0].value);
    let paso = (finalVal - inicio) / (cantidad_puntos - 1);
    let eje_x = [];
    for (let i = 0; i < cantidad_puntos; i++) {
        let x = inicio + i * paso;
        eje_x.push(x.toFixed(6));
    }
    if (amp.value === '') {
        const y = eje_x.map(x => function_x(parseFloat(x)));
    y.map(value => value.toFixed(6));

    return { eje_x, y };
    }
    else {
        const y = eje_x.map(x => amp.value * function_x(parseFloat(x)));
        y.map(value => value.toFixed(6));
        return { eje_x, y };
    
}
}

function agregarAltura() {
    const altura = parseFloat(altini.value);
    if (isNaN(altura)) {
        altura.value = 0;
        return;
    }
    const datos = obtenerDatos();
    if (!datos) return;
    
    datos.y = datos.y.map(value => parseFloat(value) + altura);
    
    if (window.myChart) window.myChart.destroy();
    window.myChart = new Chart(canva, {
        type: 'line',
        data: {
            labels: datos.eje_x,
            datasets: [{
                label: 'f(x) + altura',
                data: datos.y,
                fill: true,
                borderColor: 'rgb(12, 14, 14)',
                tension: 0.3,
            }]
        },
        options: {}
    });

}

function graficar() {
    const datos = obtenerDatos();
    if (!datos) return;
    if (window.myChart) window.myChart.destroy();
    window.myChart = new Chart(canva, {
        type: 'line',
        data: {
            labels: datos.eje_x,
            datasets: [{
                label: 'f(x)+ altura',
                data: agregarAltura() || datos.y,
                data: datos.y,
                fill: true,
                borderColor: 'rgb(12, 14, 14)',
                tension: 0.3,
            }]
        },
        options: {}
    });
}

btn.addEventListener('click', () => {
    graficar();
    graficado = true;
});

deslis.forEach((desli) => {
    desli.addEventListener('input', (e) => {
        valor.textContent = e.target.value;
        if (graficado) {
            graficar();
        }
    });
});
au.addEventListener('submit', function(event) {
    event.preventDefault();

});
