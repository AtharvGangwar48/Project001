import express from 'express';
import puppeteer from 'puppeteer';
import InstitutionalReport from '../models/InstitutionalReport.js';
import NAACReport from '../models/NAACReport.js';
import NIRFReport from '../models/NIRFReport.js';

function requireAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Authentication required' });
}

const router = express.Router();

// Create institutional report
router.post('/', requireAuth, async (req, res) => {
  try {
    const report = new InstitutionalReport({
      universityId: req.user.id,
      ...req.body
    });
    await report.save();
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate PDF report
router.get('/:id/pdf', requireAuth, async (req, res) => {
  try {
    const report = await InstitutionalReport.findById(req.params.id).populate('universityId');
    if (!report) return res.status(404).json({ message: 'Report not found' });

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    const html = generateReportHTML(report);
    await page.setContent(html);
    
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '1cm', bottom: '1cm', left: '1cm', right: '1cm' }
    });
    
    await browser.close();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="institutional-report-${report._id}.pdf"`);
    res.send(pdf);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get reports for university
router.get('/', requireAuth, async (req, res) => {
  try {
    const reports = await InstitutionalReport.find({ universityId: req.user.id });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

function generateReportHTML(report) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
        .section { margin-bottom: 30px; }
        .section-title { background: #f0f0f0; padding: 10px; font-weight: bold; font-size: 18px; }
        .content { padding: 15px; }
        .row { display: flex; margin-bottom: 10px; }
        .label { font-weight: bold; width: 200px; }
        .value { flex: 1; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>INSTITUTIONAL REPORT</h1>
        <h2>${report.basicInfo?.institutionName || 'N/A'}</h2>
        <p>Generated on: ${new Date(report.generatedAt).toLocaleDateString()}</p>
      </div>

      <div class="section">
        <div class="section-title">BASIC INFORMATION</div>
        <div class="content">
          <div class="row"><span class="label">Institution Name:</span><span class="value">${report.basicInfo?.institutionName || 'N/A'}</span></div>
          <div class="row"><span class="label">Address:</span><span class="value">${report.basicInfo?.address || 'N/A'}</span></div>
          <div class="row"><span class="label">Establishment Year:</span><span class="value">${report.basicInfo?.establishmentYear || 'N/A'}</span></div>
          <div class="row"><span class="label">Type:</span><span class="value">${report.basicInfo?.type || 'N/A'}</span></div>
          <div class="row"><span class="label">Affiliation:</span><span class="value">${report.basicInfo?.affiliation || 'N/A'}</span></div>
          <div class="row"><span class="label">Vision:</span><span class="value">${report.basicInfo?.vision || 'N/A'}</span></div>
          <div class="row"><span class="label">Mission:</span><span class="value">${report.basicInfo?.mission || 'N/A'}</span></div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">ACADEMIC INFORMATION</div>
        <div class="content">
          <div class="row"><span class="label">Programs Offered:</span><span class="value">${report.academicInfo?.programsOffered?.join(', ') || 'N/A'}</span></div>
          <div class="row"><span class="label">Total Admissions:</span><span class="value">${report.academicInfo?.studentStrength?.admissions || 'N/A'}</span></div>
          <div class="row"><span class="label">Current Enrollment:</span><span class="value">${report.academicInfo?.studentStrength?.enrollment || 'N/A'}</span></div>
          <div class="row"><span class="label">Faculty Count:</span><span class="value">${report.academicInfo?.facultyProfile?.totalFaculty || 'N/A'}</span></div>
          <div class="row"><span class="label">Research Projects:</span><span class="value">${report.academicInfo?.research?.projects || 'N/A'}</span></div>
          <div class="row"><span class="label">Publications:</span><span class="value">${report.academicInfo?.research?.publications || 'N/A'}</span></div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">INFRASTRUCTURE</div>
        <div class="content">
          <div class="row"><span class="label">Classrooms:</span><span class="value">${report.infrastructure?.classrooms || 'N/A'}</span></div>
          <div class="row"><span class="label">Laboratories:</span><span class="value">${report.infrastructure?.labs || 'N/A'}</span></div>
          <div class="row"><span class="label">Hostel Capacity:</span><span class="value">${report.infrastructure?.hostelCapacity || 'N/A'}</span></div>
          <div class="row"><span class="label">Sports Complexes:</span><span class="value">${report.infrastructure?.sportsComplexes || 'N/A'}</span></div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">FINANCIAL INFORMATION</div>
        <div class="content">
          <div class="row"><span class="label">Budget Allocation:</span><span class="value">₹${report.finance?.budgetAllocation?.toLocaleString() || 'N/A'}</span></div>
          <div class="row"><span class="label">Budget Utilization:</span><span class="value">₹${report.finance?.budgetUtilization?.toLocaleString() || 'N/A'}</span></div>
          <div class="row"><span class="label">Government Funding:</span><span class="value">₹${report.finance?.fundingSources?.government?.toLocaleString() || 'N/A'}</span></div>
          <div class="row"><span class="label">Private Funding:</span><span class="value">₹${report.finance?.fundingSources?.private?.toLocaleString() || 'N/A'}</span></div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">STUDENT SUPPORT</div>
        <div class="content">
          <div class="row"><span class="label">Scholarships Provided:</span><span class="value">${report.studentSupport?.scholarships || 'N/A'}</span></div>
          <div class="row"><span class="label">Placement Rate:</span><span class="value">${report.studentSupport?.placementRate || 'N/A'}%</span></div>
          <div class="row"><span class="label">Entrepreneurship Cells:</span><span class="value">${report.studentSupport?.entrepreneurshipCells || 'N/A'}</span></div>
        </div>
      </div>
    </body>
    </html>
  `;
}

// NAAC Report routes
router.post('/naac', requireAuth, async (req, res) => {
  try {
    const report = new NAACReport({
      universityId: req.user.id,
      ...req.body
    });
    await report.save();
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/naac/:id/pdf', requireAuth, async (req, res) => {
  try {
    const report = await NAACReport.findById(req.params.id).populate('universityId');
    if (!report) return res.status(404).json({ message: 'NAAC Report not found' });

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    const html = generateNAACReportHTML(report);
    await page.setContent(html);
    
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '1cm', bottom: '1cm', left: '1cm', right: '1cm' }
    });
    
    await browser.close();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="naac-report-${report._id}.pdf"`);
    res.send(pdf);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

function generateNAACReportHTML(report) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .header { text-align: center; border-bottom: 3px solid #1e40af; padding-bottom: 20px; margin-bottom: 30px; }
        .criterion { margin-bottom: 25px; page-break-inside: avoid; }
        .criterion-title { background: #1e40af; color: white; padding: 12px; font-weight: bold; font-size: 16px; }
        .content { padding: 15px; border: 1px solid #e5e7eb; }
        .row { display: flex; margin-bottom: 8px; }
        .label { font-weight: bold; width: 250px; color: #374151; }
        .value { flex: 1; }
        .score-box { background: #f3f4f6; padding: 10px; margin: 10px 0; border-left: 4px solid #1e40af; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>NAAC ASSESSMENT REPORT</h1>
        <h2>${report.universityId?.name || 'Institution Name'}</h2>
        <p><strong>Generated on:</strong> ${new Date(report.generatedAt).toLocaleDateString()}</p>
      </div>

      <div class="criterion">
        <div class="criterion-title">CRITERION 1: CURRICULAR ASPECTS</div>
        <div class="content">
          <div class="row"><span class="label">Curriculum Design:</span><span class="value">${report.curricularAspects?.curriculumDesign || 'N/A'}</span></div>
          <div class="row"><span class="label">CBCS Implementation:</span><span class="value">${report.curricularAspects?.cbcsImplementation || 'N/A'}</span></div>
          <div class="row"><span class="label">Stakeholder Feedback:</span><span class="value">${report.curricularAspects?.stakeholderFeedback || 'N/A'}</span></div>
          <div class="row"><span class="label">Curriculum Revision:</span><span class="value">${report.curricularAspects?.curriculumRevision || 'N/A'}</span></div>
        </div>
      </div>

      <div class="criterion">
        <div class="criterion-title">CRITERION 2: TEACHING-LEARNING AND EVALUATION</div>
        <div class="content">
          <div class="row"><span class="label">Student-Teacher Ratio:</span><span class="value">${report.teachingLearning?.studentTeacherRatio || 'N/A'}:1</span></div>
          <div class="row"><span class="label">Learning Outcomes:</span><span class="value">${report.teachingLearning?.learningOutcomes || 'N/A'}</span></div>
          <div class="row"><span class="label">Mentoring System:</span><span class="value">${report.teachingLearning?.mentoringSystem || 'N/A'}</span></div>
          <div class="row"><span class="label">Evaluation Reforms:</span><span class="value">${report.teachingLearning?.evaluationReforms || 'N/A'}</span></div>
        </div>
      </div>

      <div class="criterion">
        <div class="criterion-title">CRITERION 3: RESEARCH, INNOVATIONS & EXTENSION</div>
        <div class="content">
          <div class="row"><span class="label">Research Funding:</span><span class="value">₹${report.research?.researchFunding?.toLocaleString() || 'N/A'}</span></div>
          <div class="row"><span class="label">Publications:</span><span class="value">${report.research?.publications || 'N/A'}</span></div>
          <div class="row"><span class="label">IPR Generated:</span><span class="value">${report.research?.iprGenerated || 'N/A'}</span></div>
          <div class="row"><span class="label">Collaborations:</span><span class="value">${report.research?.collaborations || 'N/A'}</span></div>
          <div class="row"><span class="label">Extension Programs:</span><span class="value">${report.research?.extensionPrograms || 'N/A'}</span></div>
        </div>
      </div>

      <div class="criterion">
        <div class="criterion-title">CRITERION 4: INFRASTRUCTURE & LEARNING RESOURCES</div>
        <div class="content">
          <div class="row"><span class="label">Library Usage:</span><span class="value">${report.infrastructure?.libraryUsage || 'N/A'}</span></div>
          <div class="row"><span class="label">ICT-Enabled Teaching:</span><span class="value">${report.infrastructure?.ictEnabledTeaching || 'N/A'}</span></div>
          <div class="row"><span class="label">Physical Infrastructure:</span><span class="value">${report.infrastructure?.physicalInfrastructure || 'N/A'}</span></div>
        </div>
      </div>

      <div class="criterion">
        <div class="criterion-title">CRITERION 5: STUDENT SUPPORT & PROGRESSION</div>
        <div class="content">
          <div class="row"><span class="label">Placement Rate:</span><span class="value">${report.studentSupport?.placementRate || 'N/A'}%</span></div>
          <div class="row"><span class="label">Higher Studies:</span><span class="value">${report.studentSupport?.higherStudies || 'N/A'}%</span></div>
          <div class="row"><span class="label">Scholarships:</span><span class="value">${report.studentSupport?.scholarships || 'N/A'}</span></div>
          <div class="row"><span class="label">Alumni Contributions:</span><span class="value">${report.studentSupport?.alumniContributions || 'N/A'}</span></div>
        </div>
      </div>

      <div class="criterion">
        <div class="criterion-title">CRITERION 6: GOVERNANCE, LEADERSHIP & MANAGEMENT</div>
        <div class="content">
          <div class="row"><span class="label">Vision-Mission Alignment:</span><span class="value">${report.governance?.visionMissionAlignment || 'N/A'}</span></div>
          <div class="row"><span class="label">IQAC Reports:</span><span class="value">${report.governance?.iqacReports || 'N/A'}</span></div>
          <div class="row"><span class="label">Leadership Quality:</span><span class="value">${report.governance?.leadershipQuality || 'N/A'}</span></div>
        </div>
      </div>

      <div class="criterion">
        <div class="criterion-title">CRITERION 7: INSTITUTIONAL VALUES & BEST PRACTICES</div>
        <div class="content">
          <div class="row"><span class="label">Gender Equity:</span><span class="value">${report.institutionalValues?.genderEquity || 'N/A'}</span></div>
          <div class="row"><span class="label">Environmental Sustainability:</span><span class="value">${report.institutionalValues?.environmentalSustainability || 'N/A'}</span></div>
          <div class="row"><span class="label">Inclusivity Initiatives:</span><span class="value">${report.institutionalValues?.inclusivityInitiatives || 'N/A'}</span></div>
          <div class="row"><span class="label">Best Practices:</span><span class="value">${report.institutionalValues?.bestPractices || 'N/A'}</span></div>
        </div>
      </div>
    </body>
    </html>
  `;
}

// NIRF Report routes
router.post('/nirf', requireAuth, async (req, res) => {
  try {
    const report = new NIRFReport({
      universityId: req.user.id,
      ...req.body
    });
    await report.save();
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/nirf/:id/pdf', requireAuth, async (req, res) => {
  try {
    const report = await NIRFReport.findById(req.params.id).populate('universityId');
    if (!report) return res.status(404).json({ message: 'NIRF Report not found' });

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    const html = generateNIRFReportHTML(report);
    await page.setContent(html);
    
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '1cm', bottom: '1cm', left: '1cm', right: '1cm' }
    });
    
    await browser.close();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="nirf-report-${report._id}.pdf"`);
    res.send(pdf);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

function generateNIRFReportHTML(report) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .header { text-align: center; border-bottom: 3px solid #dc2626; padding-bottom: 20px; margin-bottom: 30px; }
        .parameter { margin-bottom: 25px; page-break-inside: avoid; }
        .param-title { background: #dc2626; color: white; padding: 12px; font-weight: bold; font-size: 16px; display: flex; justify-content: space-between; }
        .weightage { background: #fca5a5; color: #7f1d1d; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
        .content { padding: 15px; border: 1px solid #e5e7eb; }
        .row { display: flex; margin-bottom: 8px; }
        .label { font-weight: bold; width: 250px; color: #374151; }
        .value { flex: 1; }
        .score-highlight { background: #fef2f2; padding: 8px; border-left: 4px solid #dc2626; margin: 8px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>NIRF RANKING DATA REPORT</h1>
        <h2>${report.universityId?.name || 'Institution Name'}</h2>
        <p><strong>Generated on:</strong> ${new Date(report.generatedAt).toLocaleDateString()}</p>
      </div>

      <div class="parameter">
        <div class="param-title">
          <span>TEACHING, LEARNING & RESOURCES</span>
          <span class="weightage">30%</span>
        </div>
        <div class="content">
          <div class="row"><span class="label">Faculty-Student Ratio:</span><span class="value">${report.teachingLearning?.facultyStudentRatio || 'N/A'}:1</span></div>
          <div class="row"><span class="label">Faculty Qualification:</span><span class="value">${report.teachingLearning?.facultyQualification || 'N/A'}</span></div>
          <div class="row"><span class="label">Student Strength:</span><span class="value">${report.teachingLearning?.studentStrength?.toLocaleString() || 'N/A'}</span></div>
          <div class="row"><span class="label">Financial Resources:</span><span class="value">₹${report.teachingLearning?.financialResources?.toLocaleString() || 'N/A'}</span></div>
          <div class="row"><span class="label">Resource Utilization:</span><span class="value">${report.teachingLearning?.resourceUtilization || 'N/A'}%</span></div>
        </div>
      </div>

      <div class="parameter">
        <div class="param-title">
          <span>RESEARCH & PROFESSIONAL PRACTICE</span>
          <span class="weightage">30%</span>
        </div>
        <div class="content">
          <div class="row"><span class="label">Publications:</span><span class="value">${report.research?.publications || 'N/A'}</span></div>
          <div class="row"><span class="label">Patents:</span><span class="value">${report.research?.patents || 'N/A'}</span></div>
          <div class="row"><span class="label">Research Projects:</span><span class="value">${report.research?.projects || 'N/A'}</span></div>
          <div class="row"><span class="label">Citations:</span><span class="value">${report.research?.citations || 'N/A'}</span></div>
          <div class="row"><span class="label">IPRs:</span><span class="value">${report.research?.iprs || 'N/A'}</span></div>
          <div class="row"><span class="label">Research Collaborations:</span><span class="value">${report.research?.collaborations || 'N/A'}</span></div>
        </div>
      </div>

      <div class="parameter">
        <div class="param-title">
          <span>GRADUATION OUTCOMES</span>
          <span class="weightage">20%</span>
        </div>
        <div class="content">
          <div class="row"><span class="label">Placement Rate:</span><span class="value">${report.graduationOutcomes?.placementRate || 'N/A'}%</span></div>
          <div class="row"><span class="label">Higher Education:</span><span class="value">${report.graduationOutcomes?.higherEducation || 'N/A'}%</span></div>
          <div class="row"><span class="label">Entrepreneurship:</span><span class="value">${report.graduationOutcomes?.entrepreneurship || 'N/A'}%</span></div>
          <div class="row"><span class="label">Exam Results:</span><span class="value">${report.graduationOutcomes?.examResults || 'N/A'}%</span></div>
          <div class="row"><span class="label">Average Salary Package:</span><span class="value">₹${report.graduationOutcomes?.avgSalaryPackage?.toLocaleString() || 'N/A'}</span></div>
        </div>
      </div>

      <div class="parameter">
        <div class="param-title">
          <span>OUTREACH & INCLUSIVITY</span>
          <span class="weightage">10%</span>
        </div>
        <div class="content">
          <div class="row"><span class="label">Regional Diversity:</span><span class="value">${report.outreachInclusivity?.regionalDiversity || 'N/A'}%</span></div>
          <div class="row"><span class="label">Gender Diversity:</span><span class="value">${report.outreachInclusivity?.genderDiversity || 'N/A'}%</span></div>
          <div class="row"><span class="label">Disadvantaged Groups:</span><span class="value">${report.outreachInclusivity?.disadvantagedGroups || 'N/A'}%</span></div>
          <div class="row"><span class="label">Outreach Programs:</span><span class="value">${report.outreachInclusivity?.outreachPrograms || 'N/A'}</span></div>
        </div>
      </div>

      <div class="parameter">
        <div class="param-title">
          <span>PERCEPTION</span>
          <span class="weightage">10%</span>
        </div>
        <div class="content">
          <div class="row"><span class="label">Employer Survey Score:</span><span class="value">${report.perception?.employerSurvey || 'N/A'}/100</span></div>
          <div class="row"><span class="label">Academic Peer Survey:</span><span class="value">${report.perception?.academicPeerSurvey || 'N/A'}/100</span></div>
          <div class="row"><span class="label">Public Perception:</span><span class="value">${report.perception?.publicPerception || 'N/A'}/100</span></div>
        </div>
      </div>
    </body>
    </html>
  `;
}

export default router;