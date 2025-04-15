import listBuilder from "./animals/list.js";
import productBuilder from "./animals/index.js";
import coverBuilder from "./views/cover.ejs";
import twitter from '../asset/twitter.svg';
import contactBuilder from "./views/contact.ejs";
import aboutBuilder from './views/about.ejs';

function app(container) {
    const navItems = document.querySelectorAll('.nav-item a');
    var appObj = {
        recordPage: { page: 1, perPage: 10 },
        name: null,
        productBuilder: function (app) {
            navItems.forEach(item=>{
                item.classList.remove('active');
                item.removeAttribute('aria-current');
            });
            navItems[1].classList.add('active');
            navItems[1].setAttribute('aria-current','page');
            container.innerHTML = '';
            container.append(productBuilder(app).element);
        },
        listBuilder: function (app) {
            app.name = null;
            navItems.forEach(item=>{
                item.classList.remove('active');
                item.removeAttribute('aria-current');
            });
            navItems[2].classList.add('active');
            navItems[2].setAttribute('aria-current','page');            
            container.innerHTML = '';
            container.append(listBuilder(app).element);
        },
        coverBuilder: function(app){
            app.name = null;
            navItems.forEach(item=>{
                item.classList.remove('active');
                item.removeAttribute('aria-current');
            });
            navItems[0].classList.add('active');
            navItems[0].setAttribute('aria-current','page');            
            container.innerHTML = coverBuilder({imgLink:['./img/everything_is_object1.png',
                './img/everything_is_object2.png',
                './img/everything_is_object3.png'
            ]});
        },
        contactBuilder: function(app){
            app.name = null;
            navItems.forEach(item=>{
                item.classList.remove('active');
                item.removeAttribute('aria-current');
            });
            navItems[3].classList.add('active');
            navItems[3].setAttribute('aria-current','page');            
            container.innerHTML = contactBuilder();
        },
        aboutBuilder: function(app){
            app.name = null;
            navItems.forEach(item=>{
                item.classList.remove('active');
                item.removeAttribute('aria-current');
            });
            navItems[4].classList.add('active');
            navItems[4].setAttribute('aria-current','page');            
            container.innerHTML = aboutBuilder();
        }
    };
    const navigateTo = url => {
        history.pushState(null, null, url);
        router();
    };
    const router = async () => {
        //these are front end rout, which should match your release server folder
        const routes = [
            { path: "/", view: () => appObj.coverBuilder(appObj) },
            { path: "/animal", view: () => appObj.productBuilder(appObj) },
            { path: "/list", view: () => appObj.listBuilder(appObj) },
            { path: "/about", view: () => appObj.aboutBuilder(appObj) },
            { path: "/contact", view: () => appObj.contactBuilder(appObj) }
        ];

        const potentialMatches = routes.map(route => {
            return {
                route: route,
                isMatch: location.pathname === route.path
            };
        });

        let match = potentialMatches.find(potentialMatch => potentialMatch.isMatch);

        if (!match) {
            match = {
                route: routes[0],
                isMatch: true
            };
        }
        match.route.view();
    };

    window.addEventListener("popstate", router);

    document.addEventListener("DOMContentLoaded", () => {
        document.body.addEventListener("click", e => {
            if (e.target.matches("[data-link]")) {
                e.preventDefault();
                navigateTo(e.target.href);
            }
        });

        router();
    });

    let footImgs = document.querySelector('.ms-3 a');
    const svgElement = document.createElement('img');
    svgElement.src = twitter;
    svgElement.width = 24; // width in pixels
    svgElement.height = 24; // height in pixels
    footImgs.appendChild(svgElement);    
}

export default app;