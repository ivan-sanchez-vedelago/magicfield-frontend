// Unicamente lo declaro para que no marque como error al importar archivos CSS en los componentes.
declare module "*.css" {
  const content: any;
  export default content;
}