<template>
  <v-container class="middlealign">
    <h1>{{ $t('general.title') }}</h1>
    <h3 class="subtitle-app">{{ $t('general.subtitle') }}</h3>
    <p>
      The big five personality traits are the best accepted and most commonly
      used model of personality in academic psychology. If you take a college
      course in personality psychology, this is what you will learn about. The
      big five come from the statistical study of responses to personality
      items. Using a technique called factor analysis researchers can look at
      the responses of people to hundreds of personality items and ask the
      question "what is the best was to summarize an individual?". This has been
      done with many samples from all over the world and the general result is
      that, while there seem to be unlimited personality variables, five stand
      out from the pack in terms of explaining a lot of a persons answers to
      questions about their personality: extraversion, neuroticism,
      agreeableness, conscientiousness and openness to experience. The big-five
      are not associated with any particular test, a variety of measures have
      been developed to measure them. This test uses the Big-Five Factor Markers
      from the International Personality Item Pool, developed by Goldberg
      (1992).
    </p>

    <v-row class="container-main-options">
      <ul>
        <li>
          Scientific Validity: research included factor analysis to identify the
          5 traits of the OCEAN model.
        </li>
        <li>
          Free: the set of items was developed as a public domain alternative to
          NEO-PI
        </li>
        <li>Translated: available in more languages</li>
        <li>Quick: it takes just 10-20 minutes to answer 120 questions.</li>
      </ul>
    </v-row>
    <v-btn outlined text x-large elevation="2" class="button-style" to="/intro">
      Take the test
    </v-btn>
  </v-container>
</template>

<script>
export default {
  name: 'index',
}
</script>