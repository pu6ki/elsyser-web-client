import { HeaderController } from './HeaderController.js';
import { HomeController } from './HomeController.js';
import { AboutController } from './AboutController.js';

import { LoginController } from './AuthControllers/LoginController.js';
import { RegisterController } from './AuthControllers/RegisterController.js';

import { ProfileController } from './ProfileControllers/ProfileController.js';

import { ExamsController } from './ExamsControllers/ExamsController.js';
import { DetailedExamsController } from './ExamsControllers/DetailedExamsController.js';

import { NewsController } from './NewsControllers/NewsController.js';
import { DetailedNewsController, loadComments } from './NewsControllers/DetailedNewsController.js';

import { HomeworksController } from './HomeworksControllers/HomeworksController.js';
import { DetailedHomeworkController } from './HomeworksControllers/DetailedHomeworkController.js';
import { SubmissionsController } from './HomeworksControllers/SubmissionsController.js';
import { DetailedSubmissionController } from './HomeworksControllers/DetailedSubmissionController.js';

import { MaterialsController } from './MaterialsControllers/MaterialsController.js';
import { DetailedMaterialController } from './MaterialsControllers/DetailedMaterialController.js';

import { GradesController } from './GradesControllers/GradesController.js';
import { DetailedClassGradesController } from './GradesControllers/DetailedClassGradesController.js';

import { NotFoundController } from './NotFoundController.js';

export let controllers = {
  header: HeaderController,
  home: HomeController,
  about: AboutController,
  login: LoginController,
  register: RegisterController,
  profile: ProfileController,
  exams: ExamsController,
  detailedExam: DetailedExamsController,
  news: NewsController,
  detailedNews: DetailedNewsController,
  loadComments: loadComments,
  homeworks: HomeworksController,
  detailedHomework: DetailedHomeworkController,
  submission: SubmissionsController,
  detailedSubmission: DetailedSubmissionController,
  materials: MaterialsController,
  detailedMaterial: DetailedMaterialController,
  grades: GradesController,
  detailedClassGrades: DetailedClassGradesController,
  notFound: NotFoundController
}