import * as azdev from "azure-devops-node-api";

let orgUrl = "http://192.168.252.100:8080";

// Conexión a la instancia TFS
const tfsClient = new tfs.connect('http://192.168.252.100:8080', 'tic-manager', 'CLAVE');

// Obtener lista de branches en un proyecto específico
const projectId = 'your-project-id';
tfsClient.getWorkItemStore().then(workItemStore => {
  workItemStore.getRepositories().then(repositories => {
    const repository = repositories.find(r => r.name === 'NBO%20Collection');
    if (repository) {
      repository.getBranches().then(branches => {
        console.log(branches);
      });
    } else {
      console.error('Repositorio no encontrado');
    }
  });
});
