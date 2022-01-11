import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./pages/login/login.component";
import { HomeComponent } from "./pages/home/home.component";
import { AdministradorComponent } from "./pages/administrador/administrador.component";
import { AdministrativoComponent } from "./pages/administrativo/administrativo.component";
import { GaleriaComponent } from "./pages/galeria/galeria.component";
import { CasaComponent } from "./pages/casa/casa.component";
import { ContactoComponent } from "./pages/contacto/contacto.component";
import { NoticiaComponent } from "./pages/noticia/noticia.component";
import { AlicuotaComponent } from "./pages/alicuota/alicuota.component";
import { ResidenteComponent } from "./pages/residente/residente.component";
import { AuthGuard } from "./guards/auth.guard";
import { RolGuard } from "./guards/rol.guard";
import { AreasocialComponent } from "./pages/areasocial/areasocial.component";
import { VotacionComponent } from "./pages/votacion/votacion.component";
import { AdmingaritaComponent } from "./pages/admingarita/admingarita.component";
import { ListabitacoraComponent } from "./pages/listabitacora/listabitacora.component";
import { ExpresoescolarComponent } from "./pages/expresoescolar/expresoescolar.component";
import { EmprendimientoComponent } from "./pages/emprendimiento/emprendimiento.component";
import { ReservacionesComponent } from "./pages/reservaciones/reservaciones.component";
import { CamarasComponent } from "./pages/camaras/camaras.component";
import { CambiarcontrasenaComponent } from "./pages/cambiarcontrasena/cambiarcontrasena.component";
import { AutorizadosComponent } from "./pages/autorizados/autorizados.component";
import { MailPanelComponent } from "./pages/mail/mail-panel/mail-panel.component";
import { DetailComponent } from "./pages/mail/detail/detail.component";
import { ComposeComponent } from "./pages/mail/compose/compose.component";
import { InicioComponent } from "./pages/inicio/inicio.component";
import { HomeGuard } from "./guards/home.guard";


const routes: Routes = [
  { path: "login", component: LoginComponent, canActivate: [HomeGuard] },
  { path: "cambiarcontrasena/:usuario", component: CambiarcontrasenaComponent },

  {
    path: "home",
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "inicio",
        component: InicioComponent,
        canActivate: [RolGuard],
      },
      {
        path: "administrador",
        component: AdministradorComponent,
        canActivate: [RolGuard],
      },
      { path: "casa", component: CasaComponent, canActivate: [RolGuard] },
      {
        path: "contacto",
        component: ContactoComponent,
        canActivate: [RolGuard],
      },
      { path: "noticia", component: NoticiaComponent, canActivate: [RolGuard] },
      {
        path: "alicuota",
        component: AlicuotaComponent,
        canActivate: [RolGuard],
      },
      {
        path: "residente",
        component: ResidenteComponent,
        canActivate: [RolGuard],
      },
      {
        path: "administrativo",
        component: AdministrativoComponent,
        canActivate: [RolGuard],
      },
      { path: "galeria", component: GaleriaComponent, canActivate: [RolGuard] },
      {
        path: "areasocial",
        component: AreasocialComponent,
        canActivate: [RolGuard],
      },
      {
        path: "votacion",
        component: VotacionComponent,
        canActivate: [RolGuard],
      },
      {
        path: "admingarita",
        component: AdmingaritaComponent,
        canActivate: [RolGuard],
      },
      {
        path: "listabitacora",
        component: ListabitacoraComponent,
        canActivate: [RolGuard],
      },
      {
        path: "expresoescolar",
        component: ExpresoescolarComponent,
        canActivate: [RolGuard],
      },
      {
        path: "emprendimiento",
        component: EmprendimientoComponent,
        canActivate: [RolGuard],
      },
      {
        path: "reservaciones",
        component: ReservacionesComponent,
        canActivate: [RolGuard],
      },
      {
        path: "camaras",
        component: CamarasComponent,
        canActivate: [RolGuard],
      },
      {
        path: "autorizados",
        component: AutorizadosComponent,
        canActivate: [RolGuard],
      },
      {
        path: 'mail/:type',
        component: MailPanelComponent,
        children: [

          { path: ':id', component: DetailComponent },
          { path: 'compose', component: ComposeComponent }
        ],
        data: {
          title: '',
          urls: [

          ]
        }
      },
      { path: "**", redirectTo: "inicio" },
    ],
  },
  { path: "**", redirectTo: "login" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
