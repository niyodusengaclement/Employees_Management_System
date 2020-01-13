# Employees_Management_System
Employee Management system is an application that enables Manager to create, update, activate or suspend Employee

### GitHub repository link 
[Repository/EMS](https://github.com/niyodusengaclement/Employees_Management_System)
### Heroku app Link
[EMS/Heroku app Link](https://employeesmanagementsystem.herokuapp.com/docs)

--------------------------------------------------------------------------

## API ENDPOINTS

| Ressource URL | Methods  | Description  |
| ------- | --- | --- |
| /manager| POST | Manager account Setup |
| /manager/:email/:token/confirm| PATCH | Activating Manager account |
| /login| POST | Manager Login |
| /forget| POST | Forgot password |
| /reset/:email/:token| PUT | Reset password |
| /employees| POST | Register Employee |
| /employees/:id/activate| PUT | Activate Employee |
| /employees/:id/suspend| PUT | Suspend Employee |
| /employees/:id | PUT | Update Employee |
| /employees/:id | DELETE | Delete Employee |
| /employees/search | POST | Search Employee |

## Used Tools

### Language
```
*Javascript*
```
### Server Environment
```
 *NodeJS* (run time Environment for running JS codes)
 ```
### Framework
```
 *Express*
 ```
## Getting Started
Follow instructions below to have this project running in your local machine
## Prerequisites
You must have Node js installed
Clone this repository ```https://github.com/niyodusengaclement/Employees_Management_System.git``` or download the zip file.

## Installing
After cloning this repository to your local machine, cd into its root directory using your terminal and run the following commands

```
> npm install
```

It will install all packages and dependencies.

## Run the server
```
> npm start
```

## Author
- NIYODUSENGA Clement <clementmistico@gmail.com>

---

## License & copyright
MIT License

Copyright (c) NIYODUSENGA Clement
