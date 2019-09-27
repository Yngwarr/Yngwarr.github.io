let answers = {};

{
    let tmp;
    tmp = clear_text('Укажите имя команды, с помощью которой можно определить количество маршрутизаторов на пути от Вашего компьютера к заданному Web-сайту ?');
    answers[tmp] = 'traceroute';
}

function clear_text(text) {
    return text.toLowerCase().replace(/[^а-яa-z]/g,'');
}

function input_type(type) {
    return !!document.querySelector(`.answer input[type='${type}']`);
}

function main() 
{
    let q_type = '';
    if (input_type('checkbox')) q_type = 'checkbox';
    else if (input_type('radio')) q_type = 'radio';
    else if (input_type('text')) q_type = 'text';
    else { console.error('dunno what type of question it is'); return; }
    console.log(`question type is ${q_type}`);

    let t = document.querySelector(".qtext");
    let q = clear_text(t.innerText);
    //let as = [];
    
    if (q_type === 'text') {
        document.querySelector(`.answer input[type='text']`).value = answers
    }

    //if (q_type !== 'text') {
        //let a = document.querySelector(".answer");
        //for (let i = 0; i < as.childElementCount; ++i) { as.push(a.children[i].innerText); }
        //as = as.map(clear_text);
    //}
}

console.log('injecting...');
main();
