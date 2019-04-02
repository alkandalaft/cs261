#include <RoboCatPCH.h>
#include <time.h>
#ifdef WIN32
#include <SDL.h>
#endif

std::unique_ptr< Engine >	Engine::sInstance;


Engine::Engine() :
mShouldKeepRunning( true )
{
	SocketUtil::StaticInit();

	srand( static_cast< uint32_t >( time( nullptr ) ) );
	
	GameObjectRegistry::StaticInit();


	World::StaticInit();

	ScoreBoardManager::StaticInit();

#ifdef WIN32
	SDL_Init( SDL_INIT_VIDEO | SDL_INIT_AUDIO );
#endif
}

Engine::~Engine()
{
	SocketUtil::CleanUp();
#ifdef WIN32
	SDL_Quit();
#endif
}




int Engine::Run()
{
	return DoRunLoop();
}

void Engine::HandleEvent( SDL_Event* inEvent )
{
	// Default implementation does nothing, up to derived classes to handle them, if they so choose
	( void )inEvent;
}

int Engine::DoRunLoop()
{
	// Main message loop
	bool quit = false;
#ifdef WIN32
	SDL_Event event;
	memset( &event, 0, sizeof( SDL_Event ) );
#endif

	while( !quit && mShouldKeepRunning )
	{
#ifdef WIN32
		if( SDL_PollEvent( &event ) )
		{
			if( event.type == SDL_QUIT )
			{
				quit = true;
			}
			else
			{
				HandleEvent( &event );
			}
		}
#endif
		//else
		//{
			Timing::sInstance.Update();

			DoFrame();
		//}
	}
#ifdef WIN32
	return event.type;
#endif
return 1;
}

void Engine::DoFrame()
{
	World::sInstance->Update();
}

	
