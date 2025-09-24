let confirmar = '';

//Definicion de clases de objetos
// Clase Micro
class Micro {
    constructor(microId,microNombre,microPrecio,microStock){
        this.id=microId;
        this.nombre=microNombre;
        this.precio=microPrecio;
        this.stock=microStock;
    }
}

// Clase Mother
class Mother {
    constructor(motherId,motherNombre,motherPrecio,motherStock){
        this.id=motherId;
        this.nombre=motherNombre;
        this.precio=motherPrecio;
        this.stock=motherStock;
    }
}

// Clase RAM
class RAM {
    constructor(ramId,ramNombre,ramPrecio,ramStock){
        this.id=ramId;
        this.nombre=ramNombre;
        this.precio=ramPrecio;
        this.stock=ramStock;
    }
}

// Clase GPU
class GPU {
    constructor(gpuId,gpuNombre,gpuPrecio,gpuStock){
        this.id=gpuId;
        this.nombre=gpuNombre;
        this.precio=gpuPrecio;
        this.stock=gpuStock;
    }
}

// Clase Fuente
class Fuente {
    constructor(fuenteId,fuenteNombre,fuentePrecio,fuenteStock){
        this.id=fuenteId;
        this.nombre=fuenteNombre;
        this.precio=fuentePrecio;
        this.stock=fuenteStock;
    }
}


// Generacion de stock de productos
const p1 = new Micro (1,'AMD Ryzen 3', 30000,2000);
const p2 = new Micro (2,'Micro AMD Ryzen 5 3600G 4.2 Ghz AM4',55000,50);
const p3 = new Micro (3,'Micro AMD Ryzen 5 5600G 4.4 Ghz AM4', 70000,100);
const p4 = new Micro (4,'Micro AMD Ryzen 7 8000G 4.4 Ghz AM4', 100000,30);
const p5 = new Micro (5,'Intel Celeron G5900 ', 33000,2000);
const p6 = new Micro (6,'Micro Intel I3 - 10100F 4.3 Ghz 6Mb',60000,50);
const p7 = new Micro (7,'Micro Intel I7 - 10700F 4.8 Ghz 16 Mb', 120000,100);

const m1 = new Mother(1, 'Asus Prime B450M-A', 8000, 50);
const m2 = new Mother(2, 'Asus TUF B550M-PLUS WIFI', 20000, 20);

const r1 = new RAM(1, 'Corsair Vengeance LPX 8GB DDR4 3200MHz', 5000, 100);
const r2 = new RAM(2, 'G.Skill Ripjaws V 16GB DDR4 3600MHz', 12000, 50);

const g1 = new GPU(1, 'Nvidia GeForce RTX 3060', 50000, 10);
const g2 = new GPU(2, 'AMD Radeon RX 6700 XT', 55000, 20);

const f1 = new Fuente(1, 'EVGA 650W', 8000, 30);
const f2 = new Fuente(2, 'Corsair RM750', 14000, 15);

//creacion de arrays con objetos
const listamicro = [p1,p2,p3,p4,p5,p6,p7];
console.table(listamicro);
const listamother = [m1,m2];
console.table(listamother);
const listaram = [r1,r2];
console.table(listaram);
const listagpu = [g1,g2];
console.table(listagpu);
const listafuente = [f1,f2];
console.table(listafuente);
//declaracion de funciones
function agregarProductos(){
        
    do {
        let newprod= prompt('Ingrese el producto a agregar: \n1 - Microprocesador\n2 - Motherboard \n3 - Memorias RAM \n4 - GPU \n5- Fuente');
        while(newprod !== '1' && newprod !== '2' && newprod !== '3' && newprod !== '4' && newprod !== '5' && newprod === '') {
            alert('producto invalido');
            newprod= prompt('Ingrese el producto a agregar: \n1 - Microprocesador\n2 - Motherboard \n3 - Memorias RAM \n4 - GPU \n5- Fuente');
        }

        switch (newprod) {
            case '1':
                let microId = parseInt(prompt('Ingrese el id'));
                let microNombre = prompt('Ingrese el nombre');
                let microPrecio = parseInt(prompt('Ingrese el precio'));
                let microStock = parseInt(prompt('Ingrese el stock'));
                listamicro.push(new Micro(microId, microNombre, microPrecio, microStock));
                break;
            case '2':
                let motherId = parseInt(prompt('Ingrese el id'));
                let motherNombre = prompt('Ingrese el nombre');
                let motherPrecio = parseInt(prompt('Ingrese el precio'));
                let motherStock = parseInt(prompt('Ingrese el stock'));
                listamother.push(new Mother(motherId, motherNombre, motherPrecio, motherStock));
                break;
            case '3':
                let ramId = parseInt(prompt('Ingrese el id'));
                let ramNombre = prompt('Ingrese el nombre');
                let ramPrecio = parseInt(prompt('Ingrese el precio'));
                let ramStock = parseInt(prompt('Ingrese el stock'));
                listaram.push(new RAM(ramId, ramNombre, ramPrecio, ramStock));
                break;
            case '4':
                let gpuId = parseInt(prompt('Ingrese el id'));
                let gpuNombre = prompt('Ingrese el nombre');
                let gpuPrecio = parseInt(prompt('Ingrese el precio'));
                let gpuStock = parseInt(prompt('Ingrese el stock'));
                listagpu.push(new GPU(gpuId, gpuNombre, gpuPrecio, gpuStock));
                break;
            case '5':
                let fuenteId = parseInt(prompt('Ingrese el id'));
                let fuenteNombre = prompt('Ingrese el nombre');
                let fuentePrecio = parseInt(prompt('Ingrese el precio'));
                let fuenteStock = parseInt(prompt('Ingrese el stock'));
                listafuente.push(new Fuente(fuenteId, fuenteNombre, fuentePrecio, fuenteStock));
                break;
            default:
                alert('producto inexistente');
                break;
        }
        confirmar = prompt('¿Desea agregar otro producto? : \ns - si\nn - no');
        
        
    }  while (confirmar.toLowerCase() === 's' && confirmar !='');
}
function buscarProductos() {
    let productoBuscado = prompt('Ingrese el producto a buscar: ').toLowerCase().trim();
    let encontrado = false;
    
    // Verificar en listamicro
    encontrado = listamicro.some(producto => producto.nombre.toLowerCase() === productoBuscado);
    if (encontrado) {
      alert('El producto se encuentra en stock en listamicro');
      return;
    }
    
    // Verificar en listamother
    encontrado = listamother.some(producto => producto.nombre.toLowerCase() === productoBuscado);
    if (encontrado) {
      alert('El producto se encuentra en stock en listamother');
      return;
    }
    
    // Verificar en listaram
    encontrado = listaram.some(producto => producto.nombre.toLowerCase() === productoBuscado);
    if (encontrado) {
      alert('El producto se encuentra en stock en listaram');
      return;
    }
    
    // Verificar en listagpu
    encontrado = listagpu.some(producto => producto.nombre.toLowerCase() === productoBuscado);
    if (encontrado) {
      alert('El producto se encuentra en stock en listagpu');
      return;
    }
    
    // Verificar en listafuente
    encontrado = listafuente.some(producto => producto.nombre.toLowerCase() === productoBuscado);
    if (encontrado) {
      alert('El producto se encuentra en stock en listafuente');
      return;
    }
    
    // Si llegamos hasta aquí, el producto no se encontró en ninguno de los arrays
    alert('Producto no encontrado');
  }
  function buscarYEliminarProducto() {
    let productoEliminar = prompt('Ingrese el producto a eliminar: ').toLowerCase().trim();
    let encontrado = null;
    
    for (let i = 0; i < listamicro.length; i++) {
      if (listamicro[i].nombre.toLowerCase() === productoEliminar) {
        encontrado = listamicro[i];
        listamicro.splice(i, 1);
        alert('El producto fue eliminado! 😎');
        break;
      }
    }
    
    if (!encontrado) {
      for (let i = 0; i < listamother.length; i++) {
        if (listamother[i].nombre.toLowerCase() === productoEliminar) {
          encontrado = listamother[i];
          listamother.splice(i, 1);
          alert('El producto fue eliminado! 😎');
          break;
        }
      }
    }
    
    if (!encontrado) {
      for (let i = 0; i < listaram.length; i++) {
        if (listaram[i].nombre.toLowerCase() === productoEliminar) {
          encontrado = listaram[i];
          listaram.splice(i, 1);
          alert('El producto fue eliminado! 😎');
          break;
        }
      }
    }
    
    if (!encontrado) {
      for (let i = 0; i < listagpu.length; i++) {
        if (listagpu[i].nombre.toLowerCase() === productoEliminar) {
          encontrado = listagpu[i];
          listagpu.splice(i, 1);
          alert('El producto fue eliminado! 😎');
          break;
        }
      }
    }
    
    if (!encontrado) {
      for (let i = 0; i < listafuente.length; i++) {
        if (listafuente[i].nombre.toLowerCase() === productoEliminar) {
          encontrado = listafuente[i];
          listafuente.splice(i, 1);
          alert('El producto fue eliminado! 😎');
          break;
        }
      }
    }
    
    if (encontrado) {
      console.log('Se ha eliminado el siguiente producto:');
      console.table(encontrado);
    } else {
      console.log('Producto no encontrado');
    }
  }
  function calcularIVA() {
    let listamicro = [p1,p2,p3,p4,p5,p6,p7];
    console.table(listamicro);
    let listamother = [m1,m2];
    console.table(listamother);
    let listaram = [r1,r2];
    console.table(listaram);
    let listagpu = [g1,g2];
    console.table(listagpu);
    let listafuente = [f1,f2];
    console.table(listafuente);
  
    listamicro.forEach((producto) => {
      producto.precio_con_iva = producto.precio * 1.21;
    });
  
    listamother.forEach((producto) => {
      producto.precio_con_iva = producto.precio * 1.21;
    });
  
    listaram.forEach((producto) => {
      producto.precio_con_iva = producto.precio * 1.21;
    });
  
    listagpu.forEach((producto) => {
      producto.precio_con_iva = producto.precio * 1.21;
    });
  
    listafuente.forEach((producto) => {
      producto.precio_con_iva = producto.precio * 1.21;
    });
  
    console.table(listamicro);
    console.table(listamother);
    console.table(listaram);
    console.table(listagpu);
    console.table(listafuente);
  }
  
  function calcularPrecioDeVenta() {
    let listamicro = [p1,p2,p3,p4,p5,p6,p7];
    let listamother = [m1,m2];
    let listaram = [r1,r2];
    let listagpu = [g1,g2];
    let listafuente = [f1,f2];
  
    listamicro.forEach((producto) => {
      producto.precio_con_iva = producto.precio * 1.21;
      producto.precio_con_ganancia = producto.precio_con_iva * 1.15;
    });
  
    listamother.forEach((producto) => {
      producto.precio_con_iva = producto.precio * 1.21;
      producto.precio_con_ganancia = producto.precio_con_iva * 1.15;
    });
  
    listaram.forEach((producto) => {
      producto.precio_con_iva = producto.precio * 1.21;
      producto.precio_con_ganancia = producto.precio_con_iva * 1.15;
    });
  
    listagpu.forEach((producto) => {
      producto.precio_con_iva = producto.precio * 1.21;
      producto.precio_con_ganancia = producto.precio_con_iva * 1.15;
    });
  
    listafuente.forEach((producto) => {
      producto.precio_con_iva = producto.precio * 1.21;
      producto.precio_con_ganancia = producto.precio_con_iva * 1.15;
    });
  
    document.write("<h2>Productos con IVA y ganancia del 15%</h2>");
  
    document.write("<h3>Microprocesadores:</h3>");
    listamicro.forEach((producto) => {
      document.write(`<p>Producto: ${producto.nombre}, Precio con IVA y ganancia: $ ${producto.precio_con_ganancia}</p>`);
    });
  
    document.write("<h3>Placas madres:</h3>");
    listamother.forEach((producto) => {
      document.write(`<p>Producto: ${producto.nombre}, Precio con IVA y ganancia:$ ${producto.precio_con_ganancia}</p>`);
    });
  
    document.write("<h3>Memorias RAM:</h3>");
    listaram.forEach((producto) => {
      document.write(`<p>Producto: ${producto.nombre}, Precio con IVA y ganancia:$ ${producto.precio_con_ganancia}</p>`);
    });
  
    document.write("<h3>Placas de video:</h3>");
    listagpu.forEach((producto) => {
      document.write(`<p>Producto: ${producto.nombre}, Precio con IVA y ganancia: $ ${producto.precio_con_ganancia}</p>`);
    });
  
    document.write("<h3>Fuentes de poder:</h3>");
    listafuente.forEach((producto) => {
      document.write(`<p>Producto: ${producto.nombre}, Precio con IVA y ganancia:$ ${producto.precio_con_ganancia}</p>`);
    });
  }
  
//Home Principal
let operacion=prompt('Que operacion desea realizar? : \n1 - Agregar productos al stock\n2 - Calcular IVA \n3 - Suprimir productos \n4 - Calcular Precio de Venta \n5- Buscar un producto\n6- Salir');
switch(operacion)
{
    case '1':
        agregarProductos();
        break;
    case '2':
        calcularIVA();
        
        break;
    case '3':
        buscarYEliminarProducto();
        break;
    case '4':
        calcularPrecioDeVenta()
        break;
    case '5':
       buscarProductos();
        break;
    case '6':
       alert('Gracias por su visita!! 👍😁')
        break;
    
    default:
        
        break;
}




/* console.log(listamicro);
console.log(listamother);
console.log(listaram);
console.log(listagpu);
console.log(listafuente); */

/* for(const cpu of listamicro){
    console.log(cpu.id + ' ' + cpu.nombre + ' ' + '$ ' + cpu.precio + ' ' + cpu.stock);
}
for(const moth of listamother){
    console.log(moth.id + ' ' + moth.nombre + ' ' + '$ ' + moth.precio + ' ' + moth.stock);
}
for(const mem of listaram){
    console.log(mem.id + ' ' + mem.nombre + ' ' + '$ ' + mem.precio + ' ' + mem.stock);
}
for(const gpus of listagpu){
    console.log(gpus.id + ' ' + gpus.nombre + ' ' + '$ ' + gpus.precio + ' ' + gpus.stock);
}
for(const fuen of listafuente){
    console.log(fuen.id + ' ' + fuen.nombre + ' ' + '$ ' + fuen.precio + ' ' + fuen.stock);
}
 */
