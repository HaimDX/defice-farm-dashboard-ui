import { Build, Project } from "./models";
import { v4 as uuidv4 } from "uuid";

async function getOrCreateNewProject({ projectName }: { projectName: string }): Promise<Project> {
  let project = await Project.findOne({
    where: {
      name: projectName,
    },
  });

  if (!project) {
    project = await Project.create({
      name: projectName,
    } as any);
  }
  return project;
}

async function getOrCreateNewBuild({
  buildName,
  projectId,
  user
}: {
  buildName: string;
  projectId?: number;
  user? : string;
}): Promise<Build> {
  let existingBuild = await Build.findOne({
    where: {
      name: buildName,
      project_id: projectId || null,
    },
  });

  if (!existingBuild) {
    existingBuild = await Build.create({
      name: buildName,
      build_id: uuidv4(),
      project_id: projectId || null,
      user : user || null
    } as any);
  }
  return existingBuild;
}

export { getOrCreateNewProject, getOrCreateNewBuild };
