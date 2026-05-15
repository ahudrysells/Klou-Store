# 🚀 Klou Store - Professional POS System

Una aplicación moderna de punto de venta (POS) hecha con **React + TypeScript + Tailwind CSS**. Diseño minimalista estilo **Square POS**.

## ✨ Características

✅ **Home/Checkout Screen**
- Teclado numérico para ingreso manual de precios
- Búsqueda rápida de productos
- Carrito con contador en tiempo real
- Visualización de total

✅ **Barcode Scanner**
- Ingreso manual de códigos
- Crear nuevos productos si no existen
- Agregar automáticamente al carrito

✅ **Cart Management**
- Ver items del carrito
- Editar cantidades
- Eliminar items
- Visualizar subtotal, impuesto y total

✅ **Payment Processing**
- 4 métodos de pago: Cash, Card, Whatnot, Gift
- Cálculo automático de cambio para efectivo

✅ **Inventory Management**
- Agregar nuevos productos
- Editar productos existentes
- Eliminar productos
- Gestión de stock

✅ **Transactions History**
- Ver transacciones del día
- Historial completo
- Resumen de ventas

## 🛠️ Instalación & Setup

### Requisitos previos
- Node.js 18+ instalado
- npm o yarn

### Pasos de instalación

1. **Descarga o clona el proyecto**
```bash
cd klou-store-web
```

2. **Instala dependencias**
```bash
npm install
```

3. **Inicia en modo desarrollo**
```bash
npm run dev
```

Abre `http://localhost:3000` en tu navegador

4. **Build para producción**
```bash
npm run build
npm start
```

## 📁 Estructura de Carpetas

```
klou-store-web/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── Button.tsx
│   │   ├── Header.tsx
│   │   ├── Keypad.tsx
│   │   ├── CartItemCard.tsx
│   │   └── Navigation.tsx
│   ├── screens/             # Pantallas principales
│   │   ├── HomeScreen.tsx
│   │   ├── CartScreen.tsx
│   │   ├── PaymentScreen.tsx
│   │   ├── ScannerScreen.tsx
│   │   ├── InventoryScreen.tsx
│   │   └── TransactionsScreen.tsx
│   ├── store/               # Estado global (Zustand)
│   │   └── index.ts
│   ├── types/               # Tipos TypeScript
│   │   └── index.ts
│   ├── App.tsx              # Componente principal
│   ├── main.tsx             # Punto de entrada
│   └── index.css            # Estilos globales
├── index.html               # HTML principal
├── vite.config.ts           # Config Vite
├── tailwind.config.js       # Config Tailwind
├── tsconfig.json            # Config TypeScript
├── package.json
└── README.md
```

## 🎨 Diseño

- **Colores**: Blanco, negro, azul (similar a Square)
- **Estilo**: Minimalista y limpio
- **Tipografía**: Sistema moderno
- **Bordes redondeados**: 6-12px
- **Responsive**: Web + Mobile optimizado

## 🔧 Funcionalidades por Pantalla

### Home Screen
- Ingreso manual con teclado numérico
- Búsqueda de productos
- Visualización de total
- Acceso a carrito

### Cart Screen
- Lista de items
- Editar cantidad (+/-)
- Eliminar items
- Resumen con subtotal y total

### Payment Screen
- 4 botones de pago (Cash, Card, Whatnot, Gift)
- Cálculo automático de cambio
- Registro de transacción

### Scanner Screen
- Entrada manual de códigos
- Crear nuevos productos

### Inventory Screen
- CRUD de productos
- Gestión de stock
- Edición de precios

### Transactions Screen
- Historial de ventas
- Resumen del día
- Total histórico

## 📱 Deploy a Railway

1. **Sube a GitHub**
```bash
git init
git add .
git commit -m "Klou Store POS"
git push
```

2. **En Railway.app**
- New Project → Deploy from GitHub
- Selecciona el repo
- Railway detecta `package.json` y despliega automáticamente

3. **Tu app en línea!**
```
https://klou-store-production.up.railway.app
```

## 💡 Stack Técnico

- **React 18** - UI Framework
- **TypeScript** - Tipado estático
- **Zustand** - State management
- **Tailwind CSS** - Estilos
- **Vite** - Build tool
- **Lucide React** - Iconos

## 🚀 Próximas Mejoras

- [ ] Integración real con Square Payment API
- [ ] Scanner real con cámara
- [ ] Persistencia con AsyncStorage
- [ ] Sincronización backend
- [ ] Dark mode
- [ ] Reportes avanzados
- [ ] Múltiples usuarios

## 📝 Mock Data

La app viene con 5 productos de prueba. Agrega los tuyos en la pantalla Inventory.

## 📧 Contacto

Klou Store - Ahudry Sells LLC

---

**Hecho con ❤️ para optimizar tu negocio**
