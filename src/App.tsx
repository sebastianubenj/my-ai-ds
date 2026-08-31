function App() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-8 gap-6">
      <header className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          My AI Design System
        </h1>
        <p className="text-muted-foreground max-w-md">
          Tokens consumidos desde Figma → Style Dictionary → Tailwind v4
        </p>
      </header>

      {/* Tarjeta de prueba usando tokens semánticos */}
      <div className="bg-card text-card-foreground border border-border rounded-lg p-6 max-w-sm shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-primary" />
          <h2 className="font-semibold text-lg">Prueba de Tokens</h2>
        </div>
        
        <p className="text-sm text-muted-foreground">
          Si ves este contenedor renderizado con fondo, bordes y texto correctamente contrastados, tus tokens semánticos están aplicándose.
        </p>

        <button className="w-full py-2 px-4 bg-primary text-primary-foreground font-medium rounded-md hover:opacity-90 transition-opacity">
          Botón con token primario
        </button>
      </div>
    </div>
  )
}

export default App