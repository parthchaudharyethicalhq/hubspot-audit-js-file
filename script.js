document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('wf-form-HubSpot-Audit');
    const recommendationContainer = document.getElementById('audit-recommendations');
  
    // Toggle visibility of "Other" fields
    const toggleOtherField = (selectId, otherInputId) => {
      const select = document.getElementById(selectId);
      const otherInput = document.getElementById(otherInputId);
      select.addEventListener('change', () => {
        const values = Array.from(select.selectedOptions).map(o => o.value);
        otherInput.classList.toggle('d-none', !values.includes('Other'));
      });
    };
  
    toggleOtherField('goal', 'goal-others');
    toggleOtherField('Segmentation', 'segmentation-other');
    toggleOtherField('integrations', 'integrations-other');
  
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
  
      const userInfo = {
        firstName: document.getElementById('first-name').value,
        lastName: document.getElementById('last-name').value,
        companyUrl: document.getElementById('company-url').value,
        email: document.getElementById('email-address').value
      };
  
      const initialUserAnswers = {
        marketingHub: document.querySelector('input[name="Marketing-Hub"]:checked')?.value || '',
        salesHub: document.querySelector('input[name="Sales-Hub"]:checked')?.value || '',
        serviceHub: document.querySelector('input[name="Service-Hub"]:checked')?.value || '',
        cmsHub: document.querySelector('input[name="CMS-Hub"]:checked')?.value || '',
        opsHub: document.querySelector('input[name="Operations-Hub"]:checked')?.value || '',
        goals: Array.from(document.getElementById('goal').selectedOptions).map(opt => opt.value),
        goalsOther: document.getElementById('goal-others').value,
        improvements: Array.from(document.getElementById('improvement').selectedOptions).map(opt => opt.value),
        workflowCount: document.querySelector('input[name="workflows"]:checked')?.value || '',
        segmentation: Array.from(document.getElementById('Segmentation').selectedOptions).map(opt => opt.value),
        segmentationOther: document.getElementById('segmentation-other').value,
        underusedFeatures: Array.from(document.getElementById('features').selectedOptions).map(opt => opt.value),
        dataQuality: Array.from(document.getElementById('data-quality').selectedOptions).map(opt => opt.value),
        integrations: Array.from(document.getElementById('integrations').selectedOptions).map(opt => opt.value),
        integrationsOther: document.getElementById('integrations-other').value,
        mainChallenge: document.getElementById('challenge').value
      };
  
      const prompt = `
        Act like a HubSpot expert auditor. A user answered the following questions:
        - Marketing Hub: ${initialUserAnswers.marketingHub}
        - Sales Hub: ${initialUserAnswers.salesHub}
        - Service Hub: ${initialUserAnswers.serviceHub}
        - CMS Hub: ${initialUserAnswers.cmsHub}
        - Operations Hub: ${initialUserAnswers.opsHub}
        - Primary goals: ${initialUserAnswers.goals.join(', ')} ${initialUserAnswers.goalsOther ? `(Other: ${initialUserAnswers.goalsOther})` : ''}
        - Areas to improve: ${initialUserAnswers.improvements.join(', ')}
        - Workflow count: ${initialUserAnswers.workflowCount}
        - Segmentation: ${initialUserAnswers.segmentation.join(', ')} ${initialUserAnswers.segmentationOther ? `(Other: ${initialUserAnswers.segmentationOther})` : ''}
        - Underutilized features: ${initialUserAnswers.underusedFeatures.join(', ')}
        - Contact data quality: ${initialUserAnswers.dataQuality.join(', ')}
        - Integrations: ${initialUserAnswers.integrations.join(', ')} ${initialUserAnswers.integrationsOther ? `(Other: ${initialUserAnswers.integrationsOther})` : ''}
        - Biggest challenge: ${initialUserAnswers.mainChallenge}
  
        Based on this, provide 5 personalized recommendations to improve their use of HubSpot. 
        Prioritize actionable steps. 
        Provide the response in HTML format.
      `;
  
      try {
        const response = await fetch("https://hook.eu2.make.com/yopro1oexx44tfxgj0w7x8zdov6y6t6p", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            step: "initial",
            prompt: prompt,
            userInfo: userInfo,
            userAnswers: initialUserAnswers
          })
        });
  
        if (!response.ok) throw new Error('Failed to get a response from Make.com webhook');
  
        const html = await response.text();
        recommendationContainer.innerHTML = html;
  
      } catch (error) {
        console.error('Error:', error);
        recommendationContainer.innerHTML = `<h2>Error:</h2><p>${error.message}</p>`;
      }
    });
  });  