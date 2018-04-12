Rails.application.routes.draw do
  root 'home#barchart'

  get 'scatter', to: "home#scatter"
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
