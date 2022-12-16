let limit = 10

let prevId = null
let newId = null

let data = []

const fetchAll = async () => {
    await fetch(`https://dummyjson.com/products?limit=${limit}`)
    .then(res => res.json())
    .then(res => {
        data = res.products
    })
    .catch(error => console.error('Error:', error));
}

window.addEventListener('DOMContentLoaded', async () => {
    await fetchAll()
    showElements(data)

    window.onclick = e => {
        if (!(e.target.tagName.toLowerCase() == 'li')) return
        e.target.setAttribute("class", "clicked")
        if (prevId) {
            newId = e.target.id
            prevPos = data.findIndex(el => el.id == prevId)
            newPos = data.findIndex(el => el.id == newId)
            data = changeElements(prevPos, newPos, data)
            showElements(data)
            prevId = null
            newId = null
        } else {
            prevId = e.target.id
        }
    }

    await fetch('https://dummyjson.com/products/categories')
        .then(res => res.json())
        .then(res => {
            const parent = document.getElementById('categories')
            res.forEach(el => {
                const child = document.createElement('option')
                child.value = el
                child.innerHTML = el
                parent.appendChild(child)
            })
        })


    
    const countSlider = document.getElementById("countSlider")
    const countValue = document.getElementById("countValue")

    countSlider.oninput = () => {
        countValue.innerHTML = countSlider.value;
    }

    countSlider.addEventListener('change', async () => {
        limit = countSlider.value
        await fetchAll()
        showElements(data)
    })
})

const showElements = (list) => {
    const parent = document.getElementById('list')
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild)
    }
    const info = document.getElementById('info')
    list.forEach(el => {
        const child = document.createElement('li')
        child.setAttribute('id', el.id)

        child.addEventListener('mouseenter', () => {
            info.innerHTML = el.description
        })
        child.addEventListener('mouseleave', () => {
            info.innerHTML = ''
        })

        child.innerHTML = el.title;
        parent.appendChild(child)
    })
}

const changeElements = (newPos, prevPos, list) => {
    [list[prevPos], list[newPos]] = [list[newPos], list[prevPos]]
    return list
}

const changeCategory = async (val) => {
    console.log(val)
    if (val === 'all') {
        await fetchAll()
        showElements(data)
    } else {
        await fetch(`https://dummyjson.com/products/category/${val}?limit=${limit}`)
            .then(res => res.json())
            .then(res => {
                data = res.products
            })
            .catch(error => console.error('Error:', error));
        showElements(data)
    }
}