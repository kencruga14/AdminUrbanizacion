import { BrowserModule } from "@angular/platform-browser";
import { LOCALE_ID, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgPipesModule } from "ng-pipes";
import { MatFormFieldModule } from "@angular/material/form-field";
import {CalendarModule} from 'primeng/calendar';

import { MomentModule } from "ngx-moment";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { ColorPickerModule } from "ngx-color-picker";
import localeEs from "@angular/common/locales/es";
import { registerLocaleData } from "@angular/common";
registerLocaleData(localeEs, "es");
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./pages/login/login.component";
import { TopbarComponent } from "./components/topbar/topbar.component";
import { LeftSidebarComponent } from "./components/left-sidebar/left-sidebar.component";
import { HomeComponent } from "./pages/home/home.component";
import { FooterComponent } from "./components/footer/footer.component";
import { BreadcrumbComponent } from "./components/breadcrumb/breadcrumb.component";
import { AdministradorComponent } from "./pages/administrador/administrador.component";
import { AdministrativoComponent } from "./pages/administrativo/administrativo.component";
import { GaleriaComponent } from "./pages/galeria/galeria.component";
import { NoticiaComponent } from "./pages/noticia/noticia.component";
import { AlicuotaComponent } from "./pages/alicuota/alicuota.component";
import { ResidenteComponent } from "./pages/residente/residente.component";
import { CasaComponent } from "./pages/casa/casa.component";
import { FilterPipe } from "./pipes/filter.pipe";
import { GalhorariorPipe } from "./pipes/galhorarior.pipe";
import { GaleriaPipe } from "./pipes/galeria.pipe";
import { DirectivosPipe } from "./pipes/directivos.pipe";
import { PreguntaPipe } from "./pipes/mivoto.pipe";
import { CasaPipe } from "./pipes/casa.pipe";
import { ExpresoPipe } from "./pipes/expreso.pipe";
import { MatDatepickerModule } from "@angular/material/datepicker";

import {
  DlDateTimeDateModule,
  DlDateTimePickerModule,
} from "angular-bootstrap-datetimepicker";
import { ContactoComponent } from "./pages/contacto/contacto.component";
import { AreasocialComponent } from "./pages/areasocial/areasocial.component";
import { VotacionComponent } from "./pages/votacion/votacion.component";
import { AdmingaritaComponent } from "./pages/admingarita/admingarita.component";
import { ListabitacoraComponent } from "./pages/listabitacora/listabitacora.component";
import { ExpresoescolarComponent } from "./pages/expresoescolar/expresoescolar.component";
import { EmprendimientoComponent } from "./pages/emprendimiento/emprendimiento.component";
import { CamarasComponent } from "./pages/camaras/camaras.component";
import { ReservacionesComponent } from "./pages/reservaciones/reservaciones.component";
// import {BrowserModule} from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AccordionModule } from "primeng/accordion";
import { MenuItem } from "primeng/api";
import { MatSelectModule } from "@angular/material/select";
import { MatSliderModule } from "@angular/material/slider";
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

import { CambiarcontrasenaComponent } from "./pages/cambiarcontrasena/cambiarcontrasena.component";
import { ListboxModule } from "primeng/listbox";
import { MultiSelectModule } from "primeng/multiselect";
import { IvyCarouselModule } from "angular-responsive-carousel";

import { TreeTableModule } from "primeng/treetable";
import { TreeModule } from "primeng/tree";
import { TreeNode } from "primeng/api";
import { MatTreeModule } from "@angular/material/tree";
import { CarouselModule } from "primeng/carousel";
import { MatTabsModule } from "@angular/material/tabs";
import { MenuModule } from "primeng/menu";
import { MegaMenuItem } from "primeng/api"; //required when using MegaMenu
import { ContextMenuModule } from "primeng/contextmenu";
import { TabMenuModule } from "primeng/tabmenu";
import {
  NgbPaginationModule,
  NgbAlertModule,
} from "@ng-bootstrap/ng-bootstrap";
import { NzTabsModule } from "ng-zorro-antd/tabs";
import { NgZorroAntdModule, NZ_I18N, en_US } from "ng-zorro-antd";
import { NzButtonModule } from "ng-zorro-antd/button";
import { CommonModule } from "@angular/common";
import { IconDefinition } from "@ant-design/icons-angular";
import * as AllIcons from "@ant-design/icons-angular/icons";
import { MultiFilterPipe } from "./pipes/multifilter.pipe";
// import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from "@angular/material/core";
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TopbarComponent,
    LeftSidebarComponent,
    HomeComponent,
    FooterComponent,
    BreadcrumbComponent,
    AdministradorComponent,
    CasaComponent,
    VotacionComponent,
    AlicuotaComponent,
    ResidenteComponent,
    NoticiaComponent,
    ContactoComponent,
    GaleriaComponent,
    AdministrativoComponent,
    AreasocialComponent,
    FilterPipe,
    MultiFilterPipe,
    GalhorariorPipe,
    GaleriaPipe,
    DirectivosPipe,
    PreguntaPipe,
    CasaPipe,
    ExpresoPipe,
    AdmingaritaComponent,
    ListabitacoraComponent,
    ExpresoescolarComponent,
    EmprendimientoComponent,
    CamarasComponent,
    ReservacionesComponent,
    CambiarcontrasenaComponent,
  ],
  imports: [
    IvyCarouselModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    CalendarModule,
    NgbModule,
    NzDatePickerModule,
    FormsModule,
    NgbPaginationModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgPipesModule,
    CommonModule,
    DlDateTimeDateModule,
    NgbAlertModule,
    NzTabsModule,
    DlDateTimePickerModule,
    MomentModule,
    NgxChartsModule,
    ColorPickerModule,
    MatDatepickerModule,
    AccordionModule,
    // MatSelectModule,
    // MatSliderModule,
    ListboxModule,
    MultiSelectModule,
    TreeTableModule,
    TreeModule,
    MatTreeModule,
    CarouselModule,
    MatTabsModule,
    MenuModule,
    ContextMenuModule,
    TabMenuModule,
    NgZorroAntdModule,
    NzButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [
    MatDatepickerModule,
    MatNativeDateModule,
    { provide: LOCALE_ID, useValue: "es" },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
