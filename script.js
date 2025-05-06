document.addEventListener('DOMContentLoaded', function () {
    const formSubmit = document.querySelector('[hsa-final-submit="Yes"]');
    const recommendationContainer = document.getElementById('audit-recommendations');
  
    // On Form Submit
    formSubmit.addEventListener('click', async function (e) {
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
        You are an expert HubSpot consultant specialising in helping B2B marketing departments maximise the value of their HubSpot investment. Your task is to provide personalised recommendations based on the information users share about their business, goals, and current HubSpot setup.

        Here is the user's input:

        <user_input>
            1. Which HubSpot tools are you currently using?
            - Marketing Hub: ${initialUserAnswers.marketingHub}
            - Sales Hub: ${initialUserAnswers.salesHub}
            - Service Hub: ${initialUserAnswers.serviceHub}
            - CMS Hub: ${initialUserAnswers.cmsHub}
            - Operations Hub: ${initialUserAnswers.opsHub}

            2. What are your primary goals with HubSpot?
             ${initialUserAnswers.goals.join(', ')} ${initialUserAnswers.goalsOther ? `(Other: ${initialUserAnswers.goalsOther})` : ''}

            3. Which aspects of HubSpot are you looking to improve?
             ${initialUserAnswers.improvements.join(', ')}

            4. Approximately how many active workflows do you have in your HubSpot instance?
             ${initialUserAnswers.workflowCount}

            5. How do you currently segment your contact database? 
             ${initialUserAnswers.segmentation.join(', ')} ${initialUserAnswers.segmentationOther ? `(Other: ${initialUserAnswers.segmentationOther})` : ''}
            6. Which HubSpot features do you feel are underutilised in your current setup? 
             ${initialUserAnswers.underusedFeatures.join(', ')}
            7. How would you rate the quality of your contact data in HubSpot?
             ${initialUserAnswers.dataQuality.join(', ')}
            8. Do you use any third-party integrations with HubSpot?
             ${initialUserAnswers.integrations.join(', ')} ${initialUserAnswers.integrationsOther ? `(Other: ${initialUserAnswers.integrationsOther})` : ''}
            9. What's your biggest challenge with HubSpot right now?
             ${initialUserAnswers.mainChallenge}
        </user_input>

        Please follow these steps to provide accurate and helpful recommendations:

        1. Analyse the user's input:
        Wrap your analysis inside <situation_analysis> tags. Break down the information provided by the user, considering:
        Which HubSpot tools are you currently using?
        What are your primary goals with HubSpot?
        Which aspects of HubSpot are you looking to improve?
        Approximately how many active workflows do you have in your HubSpot instance?
        How do you currently segment your contact database?
        Which HubSpot features do you feel are underutilised in your current setup?
        How would you rate the quality of your contact data in HubSpot?
        Do you use any third-party integrations with HubSpot?
        What's your biggest challenge with HubSpot right now?

        2. Formulate clarifying questions:
        Based on your analysis, develop 3-5 targeted follow-up questions to gain deeper insight. Focus on areas where optimisation opportunities likely exist. Choose questions that will help you provide the most valuable recommendations.

        3. Analyse the hypothetical answers:
        Imagine likely responses to your clarifying questions and analyse how they would impact your recommendations. Use this analysis to refine your understanding of the user's situation.

        4. Generate personalised recommendations:
        Based on your analysis, create a set of 3-7 specific, actionable recommendations. For each recommendation:
        - Verify that it aligns with current HubSpot features and best practices
        - Ensure it directly addresses the user's stated goals and challenges
        - Cite specific HubSpot functionalities when applicable
        - Consider potential challenges or limitations in implementing the recommendation

        5. Structure your response:
        Present your recommendations in the following format:

        <summary>
        [Brief summary acknowledging the user's specific situation and challenges]
        </summary>

        <recommendations>
        [For each recommendation (3-7 total):]
        <recommendation>
        <what_to_implement>[Specific action or feature to implement]</what_to_implement>
        <why_it_helps>[Explanation of how this addresses their goals/challenges]</why_it_helps>
        <how_to_implement>
        [Step-by-step guide for implementation]
        </how_to_implement>
        <expected_results>[Description of anticipated outcomes]</expected_results>
        <potential_challenges>[Any foreseeable difficulties in implementation]</potential_challenges>
        </recommendation>
        </recommendations>

        <conclusion>
        [Encouraging statement about the value they can unlock]
        </conclusion>

        Remember:
        - Be specific and avoid generic advice
        - Prioritise recommendations by potential impact and implementation complexity
        - Use clear, jargon-free language
        - Focus on actionable advice for both quick wins and long-term success
        - Only recommend features available in their likely HubSpot license tier
        - Frame recommendations positively, focusing on opportunities
        - Provide response in HTML format.

        Your goal is to provide valuable, personalised recommendations that help the user better leverage their existing HubSpot implementation.
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
        console.log(html);
        
        recommendationContainer.innerHTML = html;

         // Hide loading div
        $('.hsa-placeholder-loader').addClass('d-none');
  
      } catch (error) {
        console.error('Error:', error);
        recommendationContainer.innerHTML = `<h2>Error:</h2><p>${error.message}</p>`;
      }
    });
    
  /* -------------------
  Handle Step navigation logic
  ---------------------- */
  function handleStepsNavigation() {
    const $steps = $('[class^="hsa-step-"]');
    const $modal = $('.hsa-modal-wrap');

    $steps.not('.hsa-step-1').addClass('d-none');

    $('[step-go-to]').on('click', async function () {
      const targetStep = $(this).attr('step-go-to');

      if (targetStep === '2') {
        const firstName = $('#first-name').val().trim();
        const lastName = $('#last-name').val().trim();
        const companyUrl = $('#company-url').val().trim();
        const email = $('#email-address').val().trim();

        let hasError = false;
        $('.form-error').remove(); // Clear any existing errors

        // First Name check
        if (!firstName) {
          $('#first-name').after('<div class="form-error">First name is required.</div>');
          hasError = true;
        }

        // Last Name check
        if (!lastName) {
          $('#last-name').after('<div class="form-error">Last name is required.</div>');
          hasError = true;
        }

        // URL check (basic pattern)
        const urlPattern = /^(www\.)?[a-z0-9-]+(\.[a-z]{2,})+$/i;
        if (!urlPattern.test(companyUrl)) {
          $('#company-url').after('<div class="form-error">Enter a valid company URL like www.example.com</div>');
          hasError = true;
        }

        // Email format check
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
          $('#email-address').after('<div class="form-error">Invalid email format.</div>');
          hasError = true;
        }

        if (hasError) return;

        // ✅ Emailable API verification
        try {
          const res = await fetch(`https://api.emailable.com/v1/verify?email=${encodeURIComponent(email)}&api_key=live_098d50d0e1545add1658`);
          const data = await res.json();

          if (data.state !== 'deliverable') {
            $('#email-address').after('<div class="form-error">Email is not deliverable.</div>');
            return;
          }

          if (data.free) {
            $('#email-address').after('<div class="form-error">Free email addresses (like Gmail, Yahoo) are not allowed. Use your business email.</div>');
            return;
          }

          if (data.disposable) {
            $('#email-address').after('<div class="form-error">Disposable email addresses are not allowed.</div>');
            return;
          }

        } catch (err) {
          $('#email-address').after('<div class="form-error">Failed to verify email address. Try again later.</div>');
          return;
        }
      }

      // ✅ If everything passed
      if (targetStep === 'Submit') {
        $modal.removeClass('d-none');
      } else {
        $steps.addClass('d-none');
        $(`.hsa-step-${targetStep}`).removeClass('d-none');

        const $section = $('.hsa-section');
        if ($section.length) {
          $('html, body').animate({
            scrollTop: $section.offset().top - 60
          }, 800);
        }
      }
    });

    // ✅ Modal "Yes"/"No" handling
    $('[hsa-final-submit]').on('click', function () {
      const action = $(this).attr('hsa-final-submit');
      if (action === 'Yes') {
        $modal.addClass('d-none');
        $steps.addClass('d-none');
        $('.hsa-step-3').removeClass('d-none');
      } else if (action === 'No') {
        $modal.addClass('d-none');
      }
    });
  }

	//Handle Modal
  function handleModalConfirmation() {
    const $modal = $('.hsa-modal-wrap');
    const $step2 = $('.hsa-step-2');
    const $step3 = $('.hsa-step-3');
  
    // Handle "Yes" click
    $('[hsa-final-submit="Yes"]').on('click', function () {
      $modal.addClass('d-none');    // Hide modal
      $step2.addClass('d-none');    // Hide Step 2
      $step3.removeClass('d-none'); // Show Step 3
      
      //Scroll top to section
      $('html, body').animate({
        scrollTop: $('.hsa-section').offset().top - 60
      }, 800);
    });
  
    // Handle "No" click
    $('[hsa-final-submit="No"]').on('click', function () {
      $modal.addClass('d-none');    // Just hide modal
    });
  }

  handleStepsNavigation();
  handleModalConfirmation();
});