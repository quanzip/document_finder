import {AfterViewInit, Component, ElementRef, Injector, Input, OnInit, ViewChild} from '@angular/core';
import {DomainDataService} from "../../../../../core/services/domain-data.service";
import {FileService} from "../../../../../shared/services/chat-client/file.service";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

@Component({
    selector: 'app-audio',
    templateUrl: './audio.component.html',
    styleUrls: ['./audio.component.scss']
})
export class AudioComponent implements OnInit, AfterViewInit {
    playState: boolean = false;
    @Input() colorTheme: 'primary' | 'blue' | 'green' | 'red' = "primary";
    @Input() mess: any;
    filePath: any;
    url: string | SafeUrl = "";
    loading: boolean = true;

    @ViewChild('audioPlayerContainer') audioPlayerContainer: ElementRef | undefined;
    @ViewChild('playIcon') playIcon: ElementRef | undefined;
    @ViewChild('seekSlider') seekSlider: ElementRef | undefined;
    @ViewChild('currentTime') currentTime: ElementRef | undefined;
    @ViewChild('audio') audio: ElementRef<HTMLAudioElement> | undefined;
    domainDataService: DomainDataService | undefined;

    public userType = {
        AGENT: 2,
        CLIENT: 1
    }

    ngOnInit() {
        this.loading = true;
        this.filePath = this.mess.files && this.mess.files[0];
        if (this.filePath) {
            this.fileService.getContentFilePublic(this.filePath, this.domainDataService?.realmName!).subscribe(res => {
                if (res.body) {
                    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(res.body));
                    this.loading = false;
                    this.audio?.nativeElement.load();
                }
            })
        }else {
            this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.mess.safeUrls[0])
            this.loading = false;
        }
    }

    constructor(domainDataService: DomainDataService, injector: Injector, private fileService: FileService, private sanitizer: DomSanitizer) {
        this.domainDataService = injector.get(DomainDataService)
    }

    ngAfterViewInit(): void {
        /** Implementation of the presentation of the audio player */

        const playIconContainer = this.playIcon!.nativeElement
        const audioPlayerContainer = this.audioPlayerContainer!.nativeElement
        const seekSlider = this.seekSlider!.nativeElement
        // const volumeSlider = document.getElementById('volume-slider')!;
        // const muteIconContainer = document.getElementById('mute-icon')!;
        let playState = 'play';
        let muteState = 'unmute';

        audioPlayerContainer.setAttribute('data-layout-mode', this.colorTheme)

        // playAnimation.goToAndStop(14, true);

        playIconContainer.addEventListener('click', () => {
            if (playState === 'play') {
                audio.play();
                this.playState = true;
                // playAnimation.playSegments([14, 27], true);
                requestAnimationFrame(whilePlaying);
                playState = 'pause';
            } else {
                audio.pause();
                this.playState = false;
                // playAnimation.playSegments([0, 14], true);
                // @ts-ignore
                cancelAnimationFrame(raf);
                playState = 'play';
            }
        });

        // muteIconContainer.addEventListener('click', () => {
        //   if(muteState === 'unmute') {
        //     // muteAnimation.playSegments([0, 15], true);
        //     audio.muted = true;
        //     muteState = 'mute';
        //   } else {
        //     // muteAnimation.playSegments([15, 25], true);
        //     audio.muted = false;
        //     muteState = 'unmute';
        //   }
        // });

        const audio = this.audio!.nativeElement;

        // @ts-ignore
        const showRangeProgress = (rangeInput) => {
            if (rangeInput === seekSlider) {
                audioPlayerContainer.style.setProperty('--seek-before-width', rangeInput.value / rangeInput.max * 100 + '%');
            } else {
                audioPlayerContainer.style.setProperty('--volume-before-width', rangeInput.value / rangeInput.max * 100 + '%');
            }
        }

        seekSlider.addEventListener('input', (e: any) => {
            showRangeProgress(e.target);
        });
        // volumeSlider.addEventListener('input', (e) => {
        //   showRangeProgress(e.target);
        // });


        /** Implementation of the functionality of the audio player */

            // const durationContainer = document.getElementById('duration')!;
        const currentTimeContainer = this.currentTime!.nativeElement
        // const outputContainer = document.getElementById('volume-output')!;
        // @ts-ignore
        let raf = null;

        audio.onended = () => {
            audio.pause();
            this.playState = false;
            // playAnimation.playSegments([0, 14], true);
            // @ts-ignore
            cancelAnimationFrame(raf);
            playState = 'play';
        }

        // @ts-ignore
        const calculateTime = (secs) => {
            secs = audio.duration - secs;
            const minutes = Math.floor(secs / 60);
            const seconds = Math.floor(secs % 60);
            const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
            return `${minutes}:${returnedSeconds}`;
        }

        // @ts-ignore
        const calculateDuration = (secs) => {
            const minutes = Math.floor(secs / 60);
            const seconds = Math.floor(secs % 60);
            const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
            return `${minutes}:${returnedSeconds}`;
        }

        const displayDuration = () => {
            currentTimeContainer.textContent = calculateDuration(audio.duration);
        }

        const setSliderMax = () => {
            // @ts-ignore
            seekSlider.max = Math.floor(audio.duration);
        }

        const displayBufferedAmount = () => {
                if (audio.buffered && audio.buffered.length > 0) {
                    const bufferedAmount = Math.floor(audio.buffered.end(audio.buffered.length - 1));
                    // @ts-ignore
                    audioPlayerContainer.style.setProperty('--buffered-width', `${(bufferedAmount / seekSlider.max) * 100}%`);
                }
        }

        const whilePlaying = () => {
            // @ts-ignore
            seekSlider.value = Math.floor(audio.currentTime);
            // @ts-ignore
            currentTimeContainer.textContent = calculateTime(seekSlider.value);
            // @ts-ignore
            audioPlayerContainer.style.setProperty('--seek-before-width', `${seekSlider.value / seekSlider.max * 100}%`);
            raf = requestAnimationFrame(whilePlaying);
        }

        audio.addEventListener('progress', displayBufferedAmount);

        if (audio.readyState > 0) {
            displayDuration();
            setSliderMax();
            displayBufferedAmount();
        } else {
            audio.addEventListener('loadedmetadata', () => {
                displayDuration();
                setSliderMax();
                displayBufferedAmount();
            });
        }

        seekSlider.addEventListener('input', () => {
            // @ts-ignore
            currentTimeContainer.textContent = calculateTime(seekSlider.value);
            if (!audio.paused) {
                // @ts-ignore
                cancelAnimationFrame(raf);
            }
        });

        seekSlider.addEventListener('change', () => {
            // @ts-ignore
            audio.currentTime = seekSlider.value;
            if (!audio.paused) {
                requestAnimationFrame(whilePlaying);
            }
        });

        // volumeSlider.addEventListener('input', (e) => {
        //   // @ts-ignore
        //   const value = e.target.value;
        //
        //   outputContainer.textContent = value;
        //   audio.volume = value / 100;
        // });
    }

}
