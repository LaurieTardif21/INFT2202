import productService from "../product.service.js";

function product(app) {
    const {name, listBuilder} = app;
    const container = document.createElement('div');
    container.classList.add('container');
    let h1 = document.createElement('h1');
    h1.innerHTML = 'Add Product';
    container.append(h1);
    container.append(document.createElement('hr'));

    const form = document.createElement('form');

    let product = null;
    function createContent() {
        const mb2 = document.createElement('div');
        mb2.classList.add('mb-2');
        //create product form content
        const mb3Name = document.createElement('div');
        mb3Name.classList.add('mb-3');
        let editableInput = `<input type="text" class="form-control" id="name" name="name">`;
        let readonlyInput = `<input type="text" class="form-control" id="name" name="name" value="${product != null ? product.name : ""}" readonly>`;
        mb3Name.innerHTML = '<label for="name" class="form-label">Product Name</label>' +
            (product != null ? readonlyInput : editableInput) +
            '<p class="text-danger d-none"></p>';
        mb2.append(mb3Name);

        const mb3Breed = document.createElement('div');
        mb3Breed.classList.add('mb-3');
        mb3Breed.innerHTML = '<label for="breed" class="form-label">Product Breed</label>' +
            `<input type="text" class="form-control" id="breed" name="breed" value="${product != null ? product.breed : ""}">` +
            '<p class="text-danger d-none"></p>';
        mb2.append(mb3Breed);

        const mb3Leg = document.createElement('div');
        mb3Leg.classList.add('mb-3');
        mb3Leg.innerHTML = '<label for="legs" class="form-label">Number of Legs</label>' +
            '<input type="text" class="form-control" id="legs" name="legs">' +
            '<p class="text-danger d-none"></p>';
        mb2.append(mb3Leg);

        const mb3Eye = document.createElement('div');
        mb3Eye.classList.add('mb-3');
        mb3Eye.innerHTML = '<label for="eyes" class="form-label">Number of Eyes</label>' +
            '<input type="text" class="form-control" id="eyes" name="eyes">' +
            '<p class="text-danger d-none"></p>';
        mb2.append(mb3Eye);

        const mb3Sound = document.createElement('div');
        mb3Sound.classList.add('mb-3');
        mb3Sound.innerHTML = '<label for="sound" class="form-label">Sound this product makes</label>' +
            '<input type="text" class="form-control" id="sound" name="sound">' +
            '<p class="text-danger d-none"></p>';
        mb2.append(mb3Sound);

        const submitBtn = document.createElement('div');
        submitBtn.innerHTML = '<button type="submit" class="btn btn-primary">' +
            'Save Product <i class="fa-solid fa-check"></i>' +
            '</button>';
        mb2.append(submitBtn);
        ///
        form.append(mb2);
        container.append(form)
        return container;
    }
    function validate() {
        let valid = true;
        // validate form
        // test that name is valid
        const name = form.name.value;
        const eleNameError = form.name.nextElementSibling

        if (name == "") {
            eleNameError.classList.remove('d-none');
            eleNameError.textContent = "You must name this product!";
            valid = false;
        } else {
            eleNameError.classList.add('d-none');
        }

        // test that breed is valid
        const breed = form.breed.value;
        const eleBreedError = form.breed.nextElementSibling
        if (breed == "") {
            eleBreedError.classList.remove('d-none');
            eleBreedError.textContent = "What type of product is this?";
            valid = false;
        } else {
            eleBreedError.classList.add('d-none');
        }

        const legs = form.legs.value;
        const eleLegsError = form.legs.nextElementSibling
        if (legs == "") {
            eleLegsError.classList.remove('d-none');
            eleLegsError.textContent = "How many legs does this product have?";
            valid = false;
        } else if (isNaN(legs)) {
            eleLegsError.classList.remove('d-none');
            eleLegsError.textContent = "This must be a number.";
            valid = false;
        } else {
            eleLegsError.classList.add('d-none');
        }

        const eyes = form.eyes.value; // check that these are numbers
        const sound = form.sound.value;
        // return if the form is valid or not
        return valid
    }
    // create a handler to deal with the submit event
    function submit(action) {
        // validate the form
        const valid = validate();
        // do stuff if the form is valid
        if (valid) {
            const formData = new FormData(form);
            const productObject = {};
            formData.forEach((value, key) => {
                if (key === 'eyes' || key === 'legs') {
                    productObject[key] = Number(value);
                }
                else {
                    productObject[key] = value;
                }
            });

            const eleNameError = form.name.nextElementSibling
            if (action == "new") {
                productService.saveProduct([productObject])
                    .then(ret=>{
                        listBuilder(app);
                    })
                    .catch(err => {
                        eleNameError.classList.remove('d-none');
                        eleNameError.textContent = "Err in adding an product record!";
                    });
            } else {
                productService.updateProduct(productObject)
                    .then(ret=>{
                        listBuilder(app);
                    })
                    .catch(err => {
                        eleNameError.classList.remove('d-none');
                        eleNameError.textContent = "Err in updating product record!";
                    });
            }
            eleNameError.classList.add('d-none');
        } else {
            console.log('were not good');
        }
    }

    if (!name) {
        createContent();
        // assign a handler to the submit event
        form.addEventListener('submit', function (event) {
            // prevent the default action from happening
            event.preventDefault();
            submit("new");
        });
    }
    else {
        h1.innerText = 'Update Product';
        productService.findProduct(name)
            .then(ret => {
                if (ret.length == 0) {
                    throw 'No record';
                }
                product = ret[0];
                createContent();
                form.addEventListener('submit', function (event) {
                    // prevent the default action from happening
                    event.preventDefault();
                    submit("update");
                });
            })
            .catch(err => { h1.innerHTML = err; });
    }
    return {
        element: container
    }
}

export default product;