import Vue from 'vue'
import App from './App.vue'

import store from './store'

import { library } from "@fortawesome/fontawesome-svg-core";
import { faBookmark as fasBookmark, faTag as fasTag, faStickyNote as fasStickyNote, faCode as fasCode, faLightbulb as fasLightbulb, faBook as fasBook, faBooks as fasBooks, faBookOpen as fasBookOpen, faThumbtack as fasThumbtack, faListUl as fasListUl, faCheckCircle as fasCheckCircle, faCertificate as fasCertificate, faBell as fasBell, faEnvelope as fasEnvelope, faCalendar as fasCalendar, faLandmark as fasLandmark, faMountains as fasMountain, faMapMarked as fasMapMarked, faPlaneDeparture as fasPlaneDeparture, faUtensilsAlt as fasUtensilsAlt, faShoppingBasket as fasShoppingBasket, faComputerClassic as fasComputerClassic, faDatabase as fasDatabase, faFlask as fasFlask, faPlanetMoon as fasPlanetMoon, faPlanetRinged as fasPlanetRinged, faFistRaised as fasFistRaised, faUserSecret as fasUserSecret, faFish as fasFish, faRadiation as fasRadiation, faHatWizard as fasHatWizard, faSpaceStationMoon as fasSpaceStationMoon, faDumpsterFire as fasDumpsterFire, faCrow as fasCrow, faInfoCircle as fasInfoCircle, faFolder as fasFolder, faSave as fasSave, faCog as fasCog } from "@fortawesome/pro-solid-svg-icons";
import { faBookmark as falBookmark, faTag as falTag, faStickyNote as falStickyNote, faCode as falCode, faLightbulb as falLightbulb, faBook as falBook, faBooks as falBooks, faBookOpen as falBookOpen, faThumbtack as falThumbtack, faListUl as falListUl, faCheckCircle as falCheckCircle, faCertificate as falCertificate, faBell as falBell, faEnvelope as falEnvelope, faCalendar as falCalendar, faLandmark as falLandmark, faMountains as falMountain, faMapMarked as falMapMarked, faPlaneDeparture as falPlaneDeparture, faUtensilsAlt as falUtensilsAlt, faShoppingBasket as falShoppingBasket, faComputerClassic as falComputerClassic, faDatabase as falDatabase, faFlask as falFlask, faPlanetMoon as falPlanetMoon, faPlanetRinged as falPlanetRinged, faFistRaised as falFistRaised, faUserSecret as falUserSecret, faFish as falFish, faRadiation as falRadiation, faHatWizard as falHatWizard, faSpaceStationMoon as falSpaceStationMoon, faDumpsterFire as falDumpsterFire, faCrow as falCrow, faInfoCircle as falInfoCircle, faFolder as falFolder, faSave as falSave, faCog as falCog, faChevronLeft as falChevronLeft, faChevronRight as falChevronRight  } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
  fasBookmark, fasTag, fasStickyNote, fasCode, fasLightbulb, fasBook, fasBooks, fasBookOpen, fasThumbtack, fasListUl, fasCheckCircle, fasCertificate, fasBell, fasEnvelope, fasCalendar, fasLandmark, fasMountain, fasMapMarked, fasPlaneDeparture, fasUtensilsAlt, fasShoppingBasket, fasComputerClassic, fasDatabase, fasFlask, fasPlanetMoon, fasPlanetRinged, fasFistRaised, fasUserSecret, fasFish, fasRadiation, fasHatWizard, fasSpaceStationMoon, fasDumpsterFire, fasCrow, fasInfoCircle, fasFolder, fasSave, fasCog,
  falBookmark, falTag, falStickyNote, falCode, falLightbulb, falBook, falBooks, falBookOpen, falThumbtack, falListUl, falCheckCircle, falCertificate, falBell, falEnvelope, falCalendar, falLandmark, falMountain, falMapMarked, falPlaneDeparture, falUtensilsAlt, falShoppingBasket, falComputerClassic, falDatabase, falFlask, falPlanetMoon, falPlanetRinged, falFistRaised, falUserSecret, falFish, falRadiation, falHatWizard, falSpaceStationMoon, falDumpsterFire, falCrow, falInfoCircle, falFolder, falSave, falCog, falChevronLeft, falChevronRight,
)

Vue.component('fa-icon', FontAwesomeIcon)


Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
