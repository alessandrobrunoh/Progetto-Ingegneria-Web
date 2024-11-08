<template>
  <section class="rules-container">
    <img
      src="https://x.boardgamearena.net/data/gamemedia/briscola/box/en_280.png?h=1693578389"
      alt="Vue logo"
    />

    <h1>INTRODUZIONE AL GIOCO</h1>
    <h3>
      Per giocare a Briscola si utilizza un mazzo di 40 carte diviso in 4 semi,
      denari, coppe, spade, bastoni, ciascuno di 10 carte. Il massimo di punti
      totalizzabili è 120, quindi l'obiettivo principale della Briscola è
      raggiungere un punteggio di almeno 61 punti alla fine della partita. Se i
      punti raggiunti sono 60 il round è considerato pari.
    </h3>
    <h1>DISTRIBUZIONE DELLE CARTE</h1>
    <h3>
      Una volta mischiato il mazzo ogni giocatore riceve tre carte, distribuite
      insieme ed in senso antiorario, viene poi scoperta la prima carta del
      mazzo che designerà il seme di Briscola. Quest'ultima viene messa per metà
      sotto al restante mazzo coperto cosicchè resterà sempre visibile ai
      giocatori durante lo svolgimento dei ogni round e sarà l'ultima carta ad
      essere pescata. Una volta distribuite le carte e designato il seme di
      Briscola ha inizio la partita
    </h3>
    <h1>SVOLGIMENTO DELLA PARTITA</h1>
    <h3>
      Ogni giocatore cercherà di aggiudicarsi la mano giocando la carta che ritiene più opportuna al fine
      di totalizzare il maggior numero di punti a fine partita. Nella Briscola a
      4 giocatori i punti vengono sommati tra i giocatori della stessa squadra.
      Colui che si aggiudica la mano pescherà la prima carta e inizierà il gioco
      nella mano successiva.
    </h3>
    <h1>CRITERI PER AGGIUDICARSI UNA MANO</h1>
    <ul>
      <li class="rules">
        <h3>
          Il primo giocatore (detto giocatore di mano)
          determina con la sua carta il seme di mano.
        </h3>
      </li>
      <li class="rules">
        <h3>
          I giocatori successivi non hanno alcun obbligo di giocare un
          particolare seme.
        </h3>
      </li>
      <li class="rules">
        <h3>
          La mano è temporaneamente aggiudicata da un altro giocatore se
          quest'ultimo posa sul tavolo una carta del seme di mano con valore di
          presa maggiore, o una carta del seme di Briscola anche se con valore
          di presa inferiore.
        </h3>
      </li>
      <li class="rules">
        <h3>
          Alla fine, quando tutti i giocatori avranno posato una carta sul
          tavolo, si aggiudicherà la mano colui che ha posato la carta di
          Briscola con valore di presa maggiore, o, in mancanza di questa, da
          colui che ha giocato la carta del seme di mano con valore di presa
          maggiore; in mancanza di carte del seme di Briscola o di carte del
          seme di mano vince il primo giocatore di mano in quanto l'unico ad
          aver posato una carta del seme di mano.
        </h3>
      </li>
      <li class="rules">
        <h3>
          Essendo il seme di mano determinato di volta in volta dalla prima
          carta giocata, può coincidere col seme di Briscola ed in questo caso
          la mano è aggiudicata da chi gioca il seme di Briscola con valore di
          presa maggiore.
        </h3>
      </li>
      <li class="rules">
        <h3>
          Colui che si aggiudica la mano prende le carte giocate in quella mano
          e le pone coperte davanti a sé, pescherà poi una carta dal mazzo
          seguito dagli altri giocatori in senso antiorario e successivamente
          sarà il primo a giocare lanciando la nuova carta di mano.
        </h3>
      </li>
    </ul>
    <h1>VALORE DELLE CARTE</h1>
    <ul>
      <li>
        <h3><b>Asso:</b> 11 punti</h3>
      </li>
      <li>
        <h3><b>Tre:</b> 10 punti</h3>
      </li>
      <li>
        <h3><b>Re:</b> 4 punti</h3>
      </li>
      <li>
        <h3><b>Cavallo:</b> 3 punti</h3>
      </li>
      <li>
        <h3><b>Fante:</b> 2 punti</h3>
      </li>
      <li>
        <h3><b>7, 6, 5, 4, 2:</b> 0 punti</h3>
      </li>
    </ul>
    <h1>CONCLUSIONE DELLA PARTITA</h1>
    <h3>
      La partita termina quando tutte le carte sono state giocate. Le utlime tre
      mani avvengono senza pescare carte dal mazzo, in quanto queste ultime
      saranno terminate. Questa particolare fase del gioco è spesso la più
      importante perché tendono a concentrarsi in essa il maggior numero di
      punti. Nelle partite a 4 giocatori, al termine del mazzo di carte da
      pescare, i compagni si scambiano le carte per qualche istante al fine di
      poter stabilire la strategia migliore per il finale del round. Alla fine
      di tutti i round vince la partita il giocatore o la coppia di giocatori
      che totalizzano il punteggio maggiore sommando i punti delle carte vinte
      nelle singole mani. Il caso di parità si verifica se entrambi i giocatori
      o entrambe le squadre totalizzano 60 punti.
    </h3>
    <h1>STRATEGIE UTILI</h1>
    <ul>
      <li class="rules">
        <h3>
          <b>Memorizzare le carte:</b> Cerca di tenere a mente le carte che sono 
          già state giocate, sia dalle tue che dagli avversari. Questo ti permetterà 
          di fare delle inferenze sulle carte che potrebbero ancora avere in mano.
        </h3>
      </li>
      <li class="rules">
        <h3>
          <b>Conta i punti:</b> Tieni traccia del punteggio tuo e degli avversari. 
          Sapere quanti punti ti mancano per vincere ti aiuterà a prendere decisioni 
          più strategiche.
        </h3>
      </li>
      <li class="rules">
        <h3>
          <b>Gestisci le briscole:</b> Le briscole sono le carte più importanti. 
          Valuta attentamente quando giocarle, cercando di massimizzare il tuo guadagno.
        </h3>
      </li>
    </ul>
    <h1>BUON DIVERTIMENTO!</h1>
  </section>
</template>

<style>
.rules-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 5vh 10vw;
  gap: 20px;
}
ul {
  padding-left: 20px;
}
.rules {
  padding-bottom: 20px;
}

.rules:last-of-type {
  padding-bottom: 0;
}

b {
  font-weight: bold;
}
</style>
