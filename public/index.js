const StorageController = (() => {

    return {
        loadBookmark(){
            let bookmarked;

            if (localStorage.getItem("bookmark") === null) {
                bookmarked = DataController.getBookmark();
            } else {
                bookmarked = JSON.parse(localStorage.getItem("bookmark"));
            };

            return bookmarked;
        },
        storeBookmark(bookmarked){
            localStorage.setItem("bookmark", JSON.stringify(bookmarked));
        },
        loadInfo(){
            let info;

            if (localStorage.getItem("info") === null) {
                info = DataController.getInfo();
            } else {
                info = JSON.parse(localStorage.getItem("info"));
            };

            return info;
        },
        storeInfo(object){
            localStorage.setItem("info", JSON.stringify(object));
        },
        loadStands(){
            let stands;

            if (localStorage.getItem("stands") === null) {
                stands = DataController.getStands();
            } else {
                stands = JSON.parse(localStorage.getItem("stands"));
            };

            return stands;
        },
        storeStands(object){
            localStorage.setItem("stands", JSON.stringify(object));
        }
    }
})();

const DataController = (() => {
    let bookmarked = false;
    let info = {
        backed: 89914,
        total: 100000,
        backers: 5007,
    };
    const time = {
        today: new Date(),
        finishingDate: new Date(2021, 5, 19),
    };
    let stands = [
        {
            id: 0,
            type: "Bamboo Stand",
            pledge: 25,
            text: "You get an ergonomic stand made of natural bamboo. You've helped us launch our promotional campaign, and you’ll be added to a special Backer member list.",
            left: 101
        },
        {
            id: 1,
            type: "Black Edition Stand",
            pledge: 75,
            text: "You get a Black Special Edition computer stand and a personal thank you. You’ll be added to our Backer member list. Shipping is included.",
            left: 64
        },
        {
            id: 2,
            type: "Mahogany Special Edition",
            pledge: 200,
            text: "You get two Special Edition Mahogany stands, a Backer T-Shirt, and a personal thank you. You’ll be added to our Backer member list. Shipping is included.",
            left: 0
        }
    ];

    return {
        getBookmark: () => bookmarked,
        getInfo: () => info,
        getTime: () => time,
        getStands: () => stands,
    }
})();

const UIController = (() => {
    const Selectors = {
        menu: ".header__menu",
        ham: ".header__ham",
        close: ".header__close",
        nav: ".header__nav",
        mainContainer: ".main__container",
        modalAdded: ".modal__added",
        bookmark: ".main__bookmark",
        counts: ".main__counts",
        mainBtns: ".main button",
        modal: ".modal",
        modalClose: ".modal__close",
        thankBtn: ".thank button",
        thank: ".thank",
        mainLeft: ".main__left",
        modalLeft: ".modal__left",
        btnsSubmit: ".modal button",
        options: ".modal__option",
        form: ".modal__form"
    };

    return {
        getSelectors: () => Selectors,
        loadBookmark: (bookmarked) => {
            if (bookmarked) {
                document.querySelector(Selectors.bookmark).classList.add("main--bookmarked");
            } else {
                document.querySelector(Selectors.bookmark).classList.remove("main--bookmarked");
            }
        },
        loadInfo: (collectedAmount, totalAmount, backerCount, finishTime, time) => {
            let width = collectedAmount / totalAmount * 100;
            if (width > 100) {
                width = 100;
            }

            const leftDayCount = Math.floor((finishTime - time) / (1000*60*60*24));

            const infoHtml = 
                `<div class="main__info">
                    <div class="main__dollars">
                        <strong>$<span>${collectedAmount.toLocaleString()}</span></strong>
                        <p>of $${totalAmount.toLocaleString()} backed</p>
                    </div>
                    <hr>
                    <div class="main__backers">
                        <strong>${backerCount.toLocaleString()}</strong>
                        <p>total backers</p>
                    </div>
                    <hr>
                    <div class="main__days">
                        <strong>${leftDayCount}</strong>
                        <p>days left</p>
                    </div>
                </div>
                <div class="main__slider">
                    <div class="main__inside" style="width: ${width}%;"></div>
                </div>`;
        
            document.querySelector(Selectors.counts).innerHTML = infoHtml;
        },
        loadStands: (objects) => {
            let mainHtml = "";
            let modalHtml = "";
            objects.forEach(object => {
                mainHtml += `
                    <div class="main__card">
                        <div class="main__stand">
                            <h3>${object.type}</h3>
                            <span>Pledge $<span>${object.pledge}</span> or more</span>
                        </div>
                        <p>${object.text}</p>
                        <div class="main__select">
                            <div class="main__left">
                                <strong>${object.left}</strong>
                                <span>left</span>
                            </div>
                            <button type="button">Select Reward</button>
                        </div>
                    </div>`;
        
                modalHtml += `
                    <div class="modal__card">
                        <div class="modal__option">
                            <div class="modal__check">
                                <img class="modal__checkIcon hide" src="/public/images/icon-check.svg" alt="check">
                            </div>
                            <div class="modal__stand">
                                <h3>${object.type}</h3>
                                <span>Pledge $${object.pledge} or more</span>
                            </div>
                        </div>
                        <p>${object.text}</p>
                        <div class="modal__left">
                            <strong>${object.left}</strong>
                            <span>left</span>
                        </div>
                        <div class="modal__continue hide">
                            <p>Enter your pledge</p>
                            <form class="modal__form">
                                <div>
                                    <input type="number" name="price" value=${object.pledge}>
                                    <span>$</span>
                                </div>
                                <input type="submit" value="Continue">
                            </form>
                        </div>
                    </div>`;
            });
        
            document.querySelector(Selectors.mainContainer).innerHTML = mainHtml;
            document.querySelector(Selectors.modalAdded).innerHTML = modalHtml;
        },
    }
})();

const App = ((ui, data, storage) => {
    const selectors = ui.getSelectors();
    let info = storage.loadInfo();
    let stands = storage.loadStands();
    let bookmarked = storage.loadBookmark();
    const time = data.getTime();

    const loadEventListeners = function () {
        document.querySelector(selectors.menu).addEventListener("click", hamMenu);
        document.querySelector(selectors.bookmark).addEventListener("click", toggleBookmark);
        document.querySelectorAll(selectors.mainBtns).forEach(btn => {
            btn.addEventListener("click", () => {
                scrollTo(0, 0);
                document.querySelector(selectors.modal).style.display = "block"
            })
        });
        document.querySelector(selectors.modalClose).addEventListener("click", () => {
            document.querySelector(selectors.modal).style.display = "none"
        });
        document.querySelector(selectors.thankBtn).addEventListener("click", () => {
            scrollTo(0, 0);
            location.reload();
        });
        document.querySelectorAll(selectors.options).forEach(option => {
            if (option.parentNode.childElementCount == 3) {
                option.addEventListener("click", backProject)
            } else {
                option.addEventListener("click", backProjectStand)
            }
        });
        document.querySelectorAll(selectors.form).forEach(form => {
            form.addEventListener("submit", submitProcess)
        });
    };

    const hamMenu = (e) => {
        if (e.target.classList.contains("header__ham")) {
            document.querySelector(selectors.ham).style.display = "none";
            document.querySelector(selectors.close).style.display = "block";
            document.querySelector(selectors.nav).style.display = "flex";
        } else if (e.target.classList.contains("header__close")) {
            document.querySelector(selectors.close).style.display = "none";
            document.querySelector(selectors.ham).style.display = "block";
            document.querySelector(selectors.nav).style.display = "none";
        }
    };

    const toggleBookmark = () => {
        bookmarked === false ? bookmarked = true: bookmarked = false;
        storage.storeBookmark(bookmarked);
        ui.loadBookmark(bookmarked);
    };

    const backProject = (e) => {
        e.currentTarget.children[0].children[0].classList.toggle("hide");
        e.currentTarget.parentNode.classList.toggle("border");
        e.currentTarget.parentNode.children[2].classList.toggle("hide")
    };

    const backProjectStand = (e) => {
        e.currentTarget.children[0].children[0].classList.toggle("hide");
        e.currentTarget.parentNode.classList.toggle("border");
        e.currentTarget.parentNode.children[3].classList.toggle("hide")
    };

    const disableElements = () => {
        document.querySelectorAll(selectors.mainLeft).forEach(l => {
            if (l.children[0].textContent == 0) {
                l.parentNode.parentNode.classList.add("main--opac");
                l.parentNode.children[1].classList.add("main--out");
                l.parentNode.children[1].disabled = true;
            }
        });
    
        document.querySelectorAll(selectors.modalLeft).forEach(l => {
            if (l.children[0].textContent == 0) {
                l.parentNode.classList.add("main--opac");
                l.nextElementSibling.children[1].children[1].disabled = true;
                l.parentNode.children[0].removeEventListener("click", backProjectStand);
            }
        });
    };

    const decreaseStand = (text) => {
        stands.forEach(stand => {
            if (stand.text === text) {
                stand.left--;
            };
        });
    };

    const submitProcess = (e) => {
        e.preventDefault();
        const price = parseFloat(e.target.children[0].children[0].value);
        info.backed += price;
        info.backers++;
        storage.storeInfo(info);

        const text = e.currentTarget.parentNode.previousElementSibling.previousElementSibling.textContent;
        decreaseStand(text);
        storage.storeStands(stands);

        ui.loadInfo(info.backed, info.total, info.backers, time.finishingDate, time.today);
        ui.loadStands(stands);
        disableElements();

        document.querySelector(selectors.modal).style.display = "none";
        document.querySelector(selectors.thank).style.display = "flex";
    };

    return {
        init: () => {
            ui.loadBookmark(bookmarked);
            ui.loadInfo(info.backed, info.total, info.backers, time.finishingDate, time.today)
            ui.loadStands(stands);
            loadEventListeners();
            disableElements();
        }
    }
})(UIController, DataController, StorageController)

App.init();