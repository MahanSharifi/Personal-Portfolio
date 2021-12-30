import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Children } from 'react';
import { ApiComponent } from './api/api.component';
import { BiquadrisComponent } from './biquadris/biquadris.component';
import { ContactComponent } from './contact/contact.component';
import { HeaderComponent } from './header/header.component';
import { IntroComponent } from './intro/intro.component';
import { JsonParserComponent } from './json-parser/json-parser.component';
import { LEDDiceComponent } from './leddice/leddice.component';
import { ProjectsComponent } from './projects/projects.component';
import { TechExperiencesComponent } from './tech-experiences/tech-experiences.component';
import { VBACalcComponent } from './vba-calc/vba-calc.component';

const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/Home', 
    pathMatch: 'full' 
  },
  { 
    path: 'Home', 
    component: HeaderComponent,
    children: [
      { 
        path: '', 
        component: IntroComponent,
          children: [
            {
            path: '',
            component: ApiComponent,
            children: [
              { 
                path: '', 
                component: ProjectsComponent,
                children: [
                  { 
                    path: '', 
                    component: TechExperiencesComponent,
                      children: [
                        {
                          path: '',
                          component: ContactComponent
                      }
                    ] 
                  },
                ]
              },
            ]
          },
        ] 
      },
    ]
  },
  { 
    path: 'Contact', 
    component: ContactComponent 
  },
  { 
    path: 'TECH', 
    component: TechExperiencesComponent
  },
  { 
    path: 'About', 
    component: IntroComponent 
  },
  { 
    path: 'Projects', 
    component: ProjectsComponent 
  },
  { 
    path: 'LEDDice', 
    component: LEDDiceComponent
  },
  { 
    path: 'VBA', 
    component: VBACalcComponent
  },
  { 
    path: 'JSONParser', 
    component: JsonParserComponent
  },
  { 
    path: 'Biquadris', 
    component: BiquadrisComponent
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })
  ],
  exports: [RouterModule]
  
})

export class AppRoutingModule {
 }

