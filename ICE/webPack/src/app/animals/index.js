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

        const mb3Description = document.createElement('div');
        mb3Description.classList.add('mb-3');
        mb3Description.innerHTML = '<label for="description" class="form-label">Product Description</label>' +
            `<input type="text" class="form-control" id="description" name="description" value="${product != null ? product.description : ""}">` +
            '<p class="text-danger d-none"></p>';
        mb2.append(mb3Description);

        const mb3Stock = document.createElement('div');
        mb3Stock.classList.add('mb-3');
        mb3Stock.innerHTML = '<label for="stock" class="form-label">Number in Stock</label>' +
            '<input type="text" class="form-control" id="stock" name="stock">' +
            '<p class="text-danger d-none"></p>';
        mb2.append(mb3Stock);

        const mb3Price = document.createElement('div');
        mb3Price.classList.add('mb-3');
        mb3Price.innerHTML = '<label for="price" class="form-label">Price</label>' +
            '<input type="text" class="form-control" id="price" name="price">' +
            '<p class="text-danger d-none"></p>';
        mb2.append(mb3Price);

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
        const description = form.description.value;
        const eleDescriptionError = form.description.nextElementSibling
        if (description == "") {
            eleDescriptionError.classList.remove('d-none');
            eleDescriptionError.textContent = "What type of product is this?";
            valid = false;
        } else {
            eleDescriptionError.classList.add('d-none');
        }

        const stock = form.stock.value;
        const eleStockError = form.stock.nextElementSibling
        if (stock == "") {
            eleStockError.classList.remove('d-none');
            eleStockError.textContent = "How many of this product have?";
            valid = false;
        } else if (isNaN(stock)) {
            eleStockError.classList.remove('d-none');
            eleStockError.textContent = "This must be a number.";
            valid = false;
        } else {
            eleStockError.classList.add('d-none');
        }

        const price = form.price.value; // check that these are numbers
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
                if (key === 'stock' || key === 'price') {
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