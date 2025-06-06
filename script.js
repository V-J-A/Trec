
const canva = document.getElementById('grafico');

const function_x = (xn) => {
    let select = document.getElementById('tipoFuncion').value;
    if (select == 'sin') return Math.sin(xn);
    if (select == 'cos') return Math.cos(xn);
    if (select == 'tan') return Math.sin(xn) / Math.cos(xn);
};

const formau = document.getElementById('formulario');
const deslis = document.getElementById('amplitudes');
const valor = document.getElementById('valor-amplitud');
const ini = document.getElementById('inicio');
const fin = document.getElementById('final');
const btn = document.getElementById('ahhhh');
const amp = document.getElementById('amplitud');
const altini = document.getElementById('alturaInicio');
const valini = document.getElementById('valor-inicio');
const valfin = document.getElementById('valor-final');
const check1 = document.getElementById('checkbox');
const check2 = document.getElementById('checkbox2');
const div1 = document.getElementById("inicio-container")
const div2 = document.getElementById("final-container");
const span1 = document.getElementById('checkbox-label');
const divcheto = document.getElementById('basta-container');
const divcheto2 = document.getElementById('callate');
const number = document.getElementById('basta');
const number2 = document.getElementById('imSoTired');
const anguloDeFase = document.getElementById('anguloDeFase');
const pulso = document.getElementById('pulso');
const color = document.getElementById('color');
const colorPagina = document.getElementById('colorPagina');
const spancolorPagina = document.getElementById('elColorPagina');
const spanColor = document.getElementById('elColor');
const title = document.getElementById('titulo-pagina');
let graficado = false; 
div1.hidden = false;
div2.hidden = false;
divcheto.hidden = true;
divcheto2.hidden = true;

number.addEventListener('input', (e) => {
    ini.value = number.value ;
    valini.textContent = e.target.value;
    console.log(e.target.value);
    if (!e.value) {
        valini.textContent = '0';
        e.value = '0';
        return;
    }
    if (graficado) {
        graficar();
    }
});

number2.addEventListener('input', (e) => {
    fin.value = number2.value;
    valfin.textContent = e.target.value;
    if (!e.target.value) {
        valfin.textContent = '0';
        e.target.value = '0';
        return;
    }
    if (fin.value <= ini.value) {
        alert('El valor final debe ser mayor que el valor inicial, BOBITO.');
        return;
    }
    if (graficado) {
        graficar();
    }
});

check1.addEventListener('change', () => {;
    if (check1.checked) {
        div1.hidden = true;
        divcheto.hidden = false;
    } else {
        div1.hidden = false;
        divcheto.hidden = true;
    }
})

check2.addEventListener('change', () => {;
    if (check2.checked) {
        div2.hidden = true;
        divcheto2.hidden = false;
    } else {
        div2.hidden = false;
        divcheto2.hidden = true;
    }
})

color.addEventListener('input', () => {
    if (window.myChart) {
        window.myChart.data.datasets[0].borderColor = color.value;
        window.myChart.update();
    }
});

function esColorOscuro(hex) {
    // Quita el # si está presente
    hex = hex.replace('#', '');
    // Convierte colores cortos (#fff) a largos (#ffffff)
    if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
    // Obtiene los valores RGB
    const r = parseInt(hex.substr(0,2),16);
    const g = parseInt(hex.substr(2,2),16);
    const b = parseInt(hex.substr(4,2),16);
    // Calcula el brillo (luminancia)
    const luminancia = 0.299*r + 0.587*g + 0.114*b;
    return luminancia < 128; // Menor a 128 es oscuro
}

colorPagina.addEventListener('input', () => {
    document.body.style.backgroundColor = colorPagina.value;
    // Detecta si el color es oscuro
    const oscuro = esColorOscuro(colorPagina.value);
    // Cambia el color de todos los span
    document.querySelectorAll('span').forEach(span => {
        span.style.color = oscuro ? 'white' : 'black';
        title.style.color = oscuro ? 'white' : 'black';
    });
    if (window.myChart) window.myChart.update();
});

// Modifica obtenerDatos para usar el input alternativo si existe
function obtenerDatos() {
    const pi = Math.PI;
    // Usa el valor del input alternativo si está activo, si no el de ini
    let c = parseFloat(anguloDeFase.value.replace(',', '.'));
    if (isNaN(c)) {
        c = 0;
    }
    let b = parseFloat(pulso.value.replace(',', '.'));
    if (isNaN(b)) {
        b = 1;
    }
    console.log(b);

    let inicio = (ini.value ? parseFloat(ini.value) : check1.checked ? parseFloat(number.value) : 0);

    let finalVal = (fin.value ? parseFloat(fin.value) : check2.checked ? parseFloat(number2.value) : 2 * pi);

    if (inicio >= finalVal) {
        alert('El valor de inicio debe ser menor que el valor final, BOBITO.');
        return null;
    }
    let cantidad_puntos = parseFloat(deslis.value.replace(',', '.'));
    let paso = (finalVal - inicio) / (cantidad_puntos - 1);
    let eje_x = [];
    for (let i = 0; i < cantidad_puntos; i++) {
        let x = inicio + i * paso;
        eje_x.push(x.toFixed(6));
    }
    if (amp.value === '') {
    y = eje_x.map(x => function_x(b * parseFloat(x) + c));
    } else {
    y = eje_x.map(x => amp.value * function_x(b * parseFloat(x) + c));
    }
    y = y.map(value => Number(value.toFixed(6)));
    return { eje_x, y, c, b };
    
    
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
            anguloDeFase: datos.c,
            pulso: datos.b,
            datasets: [{
                label: 'f(x) + altura',
                data: datos.y,
                fill: true,
                borderColor: color.value || 'rgb(12, 14, 14)',
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
            anguloDeFase: datos.b,
            datasets: [{
                label: 'f(x)+ altura',
                data: agregarAltura() || datos.y,
                data: datos.y,
                fill: true,
                borderColor: color.value || 'rgb(12, 14, 14)',
                tension: 0.3,
            }]
        },
        options: {}
    });
}

btn.addEventListener('click', () => {
    if (window.myChart) {
        window.myChart.data.datasets[0].borderColor = color.value;
        window.myChart.update();
    }
;
    graficar();
    graficado = true;
});

ini.addEventListener('input', (e) => {
    number.value = ini.value ;
    valini.textContent = e.target.value;
    if (!e.target.value) {
        valini.textContent = '0';
        e.target.value = '0';
        return;
    }
    if (window.myChart) {
        window.myChart.data.datasets[0].borderColor = color.value;
        window.myChart.update();
    }
;
    if (graficado) {
        graficar();
    }
});

fin.addEventListener('input', (e) => {
    
    valfin.textContent = e.target.value;
    number2.value = fin.value ;
    console.log(fin.value);
    if (!e.target.value) {
        valfin.textContent = '2π';
        e.target.value = '6.283185';
        return;
    }
    if (fin.value <= ini.value) {
        alert('El valor final debe ser mayor que el valor inicial, BOBITO.');
        return;
    }
    if (window.myChart) {
        window.myChart.data.datasets[0].borderColor = color.value;
        window.myChart.update();
    }
;
    if (graficado) {
        graficar();
    }
});

console.log(deslis)
deslis.addEventListener('input', (e) => {
        console.log(e.target.value);
        valor.textContent = e.target.value;
        if (graficado) {
            graficar();
        }
    });
formau.addEventListener('submit', function(event) {
    event.preventDefault();

});
