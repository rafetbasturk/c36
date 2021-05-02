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
        modalCards: ".modal__card",
        modalAdded: ".modal__added",
        bookmark: ".main__bookmark",
        counts: ".main__counts",
        mainBtns: ".main button",
        modal: ".modal",
        thankBtn: ".thank button",
        thank: ".thank",
        mainLeft: ".main__left",
        modalLeft: ".modal__left",
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
                            <button type="button" aria-label="select reward">Select Reward</button>
                        </div>
                    </div>`;
        
                modalHtml += `
                    <div class="modal__card">
                        <div class="modal__option">
                            <div class="modal__check">
                                <img class="modal__checkIcon hide" src="./public/images/icon-check.svg" alt="check">
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
                                    <input type="number" name="price" min=${object.pledge} value=${object.pledge} aria-label="select quantity">
                                    <span>$</span>
                                </div>
                                <input type="submit" value="Continue" aria-label="submit quantity">
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
    const modal = document.querySelector(selectors.modal);
    let info = storage.loadInfo();
    let stands = storage.loadStands();
    let bookmarked = storage.loadBookmark();
    const time = data.getTime();

    const loadEventListeners = () => {
        document.querySelector(selectors.menu).addEventListener("click", hamMenu);
        document.querySelector(selectors.bookmark).addEventListener("click", toggleBookmark);
        document.querySelectorAll(selectors.mainBtns).forEach((btn, i) => {
            btn.addEventListener("click", () => {
                scrollTo(0, 0);
                modal.style.display = "block";
                if (i===0) {
                    modal.firstElementChild.children[2].classList.add("border");
                    modal.firstElementChild.children[2].firstElementChild.firstElementChild.firstElementChild.classList.remove("hide");
                    modal.firstElementChild.children[2].lastElementChild.classList.remove("hide");
                } else if (i>0){
                    modal.firstElementChild.lastElementChild.children[i-1].classList.add("border");
                    modal.firstElementChild.lastElementChild.children[i-1].firstElementChild.firstElementChild.firstElementChild.classList.remove("hide");
                    modal.firstElementChild.lastElementChild.children[i-1].lastElementChild.classList.remove("hide");
                }
            });
        });
        
        modal.addEventListener("click", (e) => {
            if(e.target.classList.contains("modal") || e.target.classList.contains("modal__close")){
                document.querySelectorAll(selectors.modalCards).forEach(card => {
                    if (card.classList.contains("border")){
                        card.classList.remove("border");
                        card.firstElementChild.firstElementChild.firstElementChild.classList.add("hide");
                        card.lastElementChild.classList.add("hide");
                    }
                })
                modal.style.display = "none"
            };
        });
        document.querySelector(selectors.thankBtn).addEventListener("click", () => {
            scrollTo(0, 0);
            location.reload();
            document.querySelectorAll(selectors.options).forEach(option => {
                if(option.parentElement.classList.contains("border")){
                    option.parentElement.classList.remove("border");
                }
            });
        });
        document.querySelectorAll(selectors.options).forEach(option => {
            option.addEventListener("click", backProject);
        });
        document.querySelectorAll(selectors.form).forEach(element => {
            element.addEventListener("submit", submitProcess)
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
        document.querySelectorAll(selectors.modalCards).forEach(card => {
            card.classList.remove("border");
            card.firstElementChild.firstElementChild.firstElementChild.classList.add("hide");
            card.lastElementChild.classList.add("hide");
        });

        e.currentTarget.parentElement.classList.add("border");
        e.currentTarget.parentElement.firstElementChild.firstElementChild.firstElementChild.classList.remove("hide");
        e.currentTarget.parentElement.lastElementChild.classList.remove("hide");
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
                l.parentNode.children[0].removeEventListener("click", backProject);
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