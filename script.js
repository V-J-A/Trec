const function_x = (x   ) => {
    return x ** 2;
}

const x = [1, 2, 3, 4, 5];
const y = x.map(x => function_x(x));
console.log(y);

const canva = document.getElementById('grafico')
window.myChart = new Chart(canva, {
    type: 'line',
    data: {
        labels: x,
        datasets: [{
            label: 'f(x)',
            data: y,
            fill: true,
            borderColor: 'rgb(12, 14, 14)',
            tension: 0.1
        }]
    },
    options: {}
});