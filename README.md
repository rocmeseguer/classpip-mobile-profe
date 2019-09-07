# Classpip Administration Dashboard
[![Classpip Badge](https://img.shields.io/badge/classpip-dashboard-brightgreen.svg)](https://github.com/rocmeseguer/classpip-dashboard)
[![Classpip Badge](https://img.shields.io/badge/classpip-mobile-brightgreen.svg)](https://github.com/rocmeseguer/classpip-mobile)
[![Classpip Badge](https://img.shields.io/badge/classpip-services-brightgreen.svg)](https://github.com/rocmeseguer/classpip-services)
[![license](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](https://github.com/classpip/classpip/blob/master/LICENSE)

Classpip is a software architecture for teachers and students to perform school gamification activities inside the school environment through different platforms such as mobiles, tablets and computers.

The software architecture is composed by a mobile application for performing “quick” class activities oriented to teachers and students. For “long” operations such as deep into reports and setup the platform there is an administration dashboard accessible from every computer. These two pieces shares the information through a service-oriented architecture that exposes the main methods for data manipulation.

![classpip-arch](https://github.com/classpip/classpip/raw/master/images/project-architecture.png)

## Global dependencies

Make sure you have NodeJS installed. Download the installer [here](https://nodejs.org/dist/latest-v8.x/) or use your favorite package manager. It's best to get the 8x version of node along with the 5x version of npm. This offers the best in stability and speed for building.

```
node -v
> v8.6.0
npm -v
> 5.6.0
```

Ahora no se que versión recomendamos instalar. 
```
npm install -g ionic@????
npm install -g cordova@????
```

## Local dependencies

All the project dependencies are manage through [npmjs](https://www.npmjs.com/). This command will also download the typings configured in the **typings.json** file. To install this dependencies you should run:

```
npm install
```


## License

Classpip is released under the [Apache2 License](https://github.com/classpip/classpip-mobile/blob/master/LICENSE).
