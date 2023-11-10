let surah=document.querySelector('.content');
let texxt=document.querySelector('.text');
let sound=document.querySelector('.playerr');
let prev=document.querySelector('.prev');
let play=document.querySelector('.play');
let next=document.querySelector('.next');
let homePage=document.querySelector('.home');
let surahShow=document.querySelector('.surahShow');
let surahArabicName=document.querySelector('.surahName');
let surahcontent=document.querySelector('.surahContentText');
let details=document.querySelector('.details')
let ayahText;


const quranShow = async ()=>{
    let result  = await fetch('http://api.alquran.cloud/v1/quran/ar.alafasy') ;
    let data    = await  result.json();
    let surahs  = await data.data.surahs;
    for(let i=0;i<surahs.length;i++){
        let arabicName=data.data.surahs[i].name;
        let englishName=data.data.surahs[i].englishName;
        let ayahLength=data.data.surahs[i].ayahs.length;
        let surahsType=data.data.surahs[i].revelationType;
        surah.innerHTML+=`
        <div class='surahContent'>
        <h3> ${arabicName} </h3>
        <p> English: ${englishName}</p>
        <p> Place:   ${surahsType}</p>
        <p> Ayahs:   ${ayahLength}</p>
    </div>
        `
    }

    let allSurahs=document.querySelectorAll('.content div'),
    ayahAudios;
    allSurahs.forEach((ele,index)=>{
        ele.addEventListener('click',async ()=>{
            let result=await fetch(`http://api.alquran.cloud/v1/quran/ar.alafasy `);
            let data=await result.json();
            let verses= await data.data.surahs[index].ayahs;
            
                
                ayahText=[];
                ayahAudios=[];
                surahName=[];
                verses.forEach(vers=>{
                    ayahAudios.push(vers.audio)
                    ayahText.push(`${vers.text}`);
                    surahName.push(data.data.surahs[index].name)
                })
                
                let ayahIndex=0;
                changeAyah(ayahIndex);
                sound.addEventListener('ended',()=>{
                    ayahIndex++;
                    if(ayahIndex<ayahAudios.length){
                        changeAyah(ayahIndex);
                    }
                    else{
                        
                        ayahIndex=0;
                        changeAyah(ayahIndex)
                        sound.pause();

                        // alert is show when surah is ended
                        Swal.fire({
                            position:'center',
                            icon:'success',
                            title:'Surah is Ended',
                            showConfirmButton:false,
                            timer:1700

                        })

                        isPlaying = true;
                        togglePlay()
                        
                    }
                })

                // forward sound 
                next.addEventListener('click',()=>{
                    ayahIndex<ayahAudios.length-1 ? ayahIndex++ :ayahIndex=0;
                    changeAyah(ayahIndex)
                })
               // backword sound
                prev.addEventListener('click',()=>{
                    ayahIndex==0?ayahIndex=ayahAudios.length-1:ayahIndex-- ;
                    changeAyah(ayahIndex)
                })

                // play and pause sound
                let isPlaying = false ;
                togglePlay()
                function togglePlay()
                {
                if(isPlaying)
                    {   
                        sound.pause();
                        play.innerHTML = `<i class="fas fa-play"></i>`;
                        isPlaying =false;
                    }
                    else
                    {
                        sound.play();
                        play.innerHTML = `<i class="fas fa-pause"></i>`;
                        isPlaying = true;
                    }
                    
                }
                play.addEventListener('click',togglePlay)

                // function to change ayah
                function changeAyah(index){
                    sound.src=ayahAudios[index];
                    texxt.innerHTML=ayahText[index];
                    details.style.display='flex';
                    homePage.classList.add('ss')
                    surah.style.display='none';
                    surahShow.style.display='flex';
                    surahArabicName.innerText=` ${surahName[0]} `;
                    surahcontent.innerText=`${ayahText}`
                }
                
                // return to home page 
                homePage.addEventListener('click',()=>{
                    surah.style.display='flex';
                    surah.style.flexDirection='column';
                    surahShow.style.display='none';
                    details.style.display='none';
                    sound.pause()
                })

                

            })
        })
        


                // Show and hide surah when scrolling
                window.addEventListener('scroll',reveal);
                function reveal(){
                    for (let index = 0; index < allSurahs.length; index++) {
                
                        let windowHeight=window.innerHeight;
                        let revealTop=allSurahs[index].getBoundingClientRect().top;
                        let revealPoint=100;
                        let arealength=windowHeight-revealPoint
                        revealTop < arealength ? allSurahs[index].classList.add('active'):allSurahs[index].classList.remove('active')
                
                    }

                }        
}

                // Show the button the move you to top when scrolling
                let span=document.querySelector('.up');
                window.onscroll=()=>{
                    this.scrollY >= 5000?span.classList.add('show'):span.classList.remove('show')
                }

                span.onclick=()=>{
                    window.scrollTo({
                        top:0,
                        behavior:'smooth',
                    })
                }



quranShow()






