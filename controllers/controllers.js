import { headerController } from './headerController.js';
import { homeController } from './homeController.js';
import { aboutController } from './aboutController.js';
import { auth } from './authControllers.js';
import { profileController } from './profileControllers.js';
import { exams } from './examsControllers.js'
import { grades } from './gradesControllers.js';
import { materials } from './materialsControllers.js';
import { news, loadComments } from './newsControllers.js';
import { homeworks } from './homeworksControllers.js';
import { notFoundController } from './notFoundController.js';

export let controllers = {
  header: headerController,
  home: homeController,
  about: aboutController,
  login: auth.login,
  register: auth.register,
  profile: profileController,
  exams: exams.allExams,
  detailedExam: exams.detailedExam,
  news: news.allNews,
  detailedNews: news.detailedNews,
  loadComments: loadComments,
  homeworks: homeworks.allHomeworks,
  detailedHomework: homeworks.detailedHomework,
  submission: homeworks.allSubmissions,
  detailedSubmission: homeworks.detailedSubmission,
  materials: materials.allMaterials,
  detailedMaterial: materials.detailedMaterial,
  grades: grades.allGrades,
  detailedClassGrades: grades.detailedClassGrades,
  notFound: notFoundController
}